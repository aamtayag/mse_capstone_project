
/*********************************************************************************************************************************************************/
/******************************************************************** Environment Setup ******************************************************************/
/*********************************************************************************************************************************************************/

require('dotenv').config();

const fs         = require('fs');
const path       = require('path');
const bcrypt     = require('bcrypt');
const multer     = require('multer');
const express    = require('express');
const bodyParser = require('body-parser');
const session    = require('express-session');
const sqlite3    = require('sqlite3').verbose();
const http       = require('http');
const { Server } = require('socket.io');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');

const app    = express();
const server = http.createServer(app);
const db     = new sqlite3.Database(path.join(__dirname, 'RoadHazard.sqlite'));
const io     = new Server(server);

const SMTP_USER = process.env.SMTP_USER || 'yoobeestud@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'Password123';
const ALERT_EMAIL = process.env.ALERT_EMAIL || 'yoobeestud@gmail.com';
const SESSION_SECRET = process.env.SESSION_SECRET || 'a very secret key';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '123456abcdef7891011ghijkl1213145';

const PORT = process.env.PORT
   ? parseInt(process.env.PORT, 10)
   : 3000;

const RADIUS = process.env.RADIUS
   ? parseFloat(process.env.RADIUS, 10)
   : 1.0;

const DAILY_UPVOTE_LIMIT = process.env.DAILY_UPVOTE_LIMIT
   ? parseInt(process.env.DAILY_UPVOTE_LIMIT, 10)
   : 5;

const UPVOTE_THRESHOLD = process.env.UPVOTE_THRESHOLD
   ? parseInt(process.env.UPVOTE_THRESHOLD, 10)
   : 3;


/////////////////////////////////////////////////////////////////////////////////
// --- session + body parsing
/////////////////////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
   res.cookie('RADIUS_KM', RADIUS, {
      httpOnly: false,
      sameSite: 'Strict'
   });
   next();
});

//app.use(bodyParser.json());
app.use(express.json());                                // for POST /api/reports
app.use(bodyParser.urlencoded({ extended: false }));    // for form submissions
app.use(session({
   secret: SESSION_SECRET,
   resave: false,
   saveUninitialized: false
}));

/////////////////////////////////////////////////////////////////////////////////
// --- socket.io
/////////////////////////////////////////////////////////////////////////////////
io.on('connection', socket => {
   console.log('🟢 Client connected');
});


/////////////////////////////////////////////////////////////////////////////////
// --- ensure uploads directory (images) exists
/////////////////////////////////////////////////////////////////////////////////
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}


/////////////////////////////////////////////////////////////////////////////////
// --- auth-protect dashboard.html
/////////////////////////////////////////////////////////////////////////////////

app.get('/dashboard.html', (req, res) => {
   if (!req.session.user_id) return res.redirect('/?error=login');
   res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

/*
app.get('/hazards.html', (req, res) => {
   if (!req.session.user_id) return res.redirect('/?error=login');
   res.sendFile(path.join(__dirname, 'public', 'hazards.html'));
});

app.get('/admin.html', (req, res) => {
   const user_type = req.session.user_type_id;
   // allow both admin (1) and admin support (2)
   if (!req.session.user_id || (user_type !== 1 && user_type !== 2)) {
      return res.redirect('/?error=login');
   }
   res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
*/

/////////////////////////////////////////////////////////////////////////////////
// --- serve static assets (HTML/CSS/JS/etc) & image uploads
/////////////////////////////////////////////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));


/////////////////////////////////////////////////////////////////////////////////
// --- multer setup for image uploads
/////////////////////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, uploadDir),
   filename:    (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fn  = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
      cb(null, fn);
   }
});
const upload = multer({ storage });


/////////////////////////////////////////////////////////////////////////////////
// --- setup email sender
/////////////////////////////////////////////////////////////////////////////////
const transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
   }
});


/////////////////////////////////////////////////////////////////////////////////
// --- encryption/decryption for PII
/////////////////////////////////////////////////////////////////////////////////
function encrypt(text) {
   if (!text) return '';
   const iv = crypto.randomBytes(16);
   const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
   const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
   // Store iv + ciphertext in one string, separated by “:”
   return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(encStr) {
   if (!encStr) return '';
   const [ivHex, dataHex] = encStr.split(':');
   const iv = Buffer.from(ivHex, 'hex');
   const encryptedText = Buffer.from(dataHex, 'hex');
   const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
   const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
   return decrypted.toString('utf8');
}


/*********************************************************************************************************************************************************/
/************************************************************* API Endpoints / Server Routes *************************************************************/
/*********************************************************************************************************************************************************/


/*********************************************************************************************************************************************************/
// --- A. User Login / Registration APIs
/*********************************************************************************************************************************************************/

/////////////////////////////////////////////////////////////////
// --- User Login (called from index.html)
/////////////////////////////////////////////////////////////////
app.post('/login', (req, res) => {
   console.log("⚡ Entry point: app.post('/login')")                                                              //debugging
   //console.log('  Request Body:', req.body);                                                                   //debugging-show incoming data
   const { username, password } = req.body;
   db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) return res.sendStatus(500);
      if (!user) return res.redirect('/?error=invalid');
      bcrypt.compare(password, user.password_hash, (err, ok) => {
         if (err) return res.sendStatus(500);
         if (!ok) return res.redirect('/?error=invalid');
         req.session.user_id = user.user_id;
         req.session.user_type_id = user.user_type_id;
         /*
         // redirect based on user role
         if (user.user_type_id === 1 || user.user_type_id === 2) {
         //if ([1, 2].includes(user.user_type_id)) {
            // user is either admin or admin support, show admin dashboard
            //return res.redirect('/admin.html');
            return res.redirect('/dashboard.html');
         } else {
            // user is a general user, , show hazard reporting page
            //return res.redirect('/hazards.html');
            return res.redirect('/dashboard.html');
         } */
         // Redirect to dashboard.html
         //return res.redirect(`/dashboard.html?user_id=${user.user_id}&user_type_id=${user.user_type_id}`);
         //return res.redirect('/dashboard_new.html');
         return res.redirect('/dashboard.html');
      });
   });
   console.log("✅ Exit point: app.post('/login')");                                                              //debugging
});

app.get('/api/session-user', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/session-user')")                                                    //debugging
   if (!req.session.user_id) return res.status(401).json({error: 'Not authenticated'});
   db.get('SELECT user_id, user_type_id, username FROM users WHERE user_id = ?', [req.session.user_id], (err, user) => {
      if (err || !user) return res.status(500).json({error: 'Could not retrieve user'});
      res.json({
         user_id: user.user_id,
         user_type_id: user.user_type_id,
         username: user.username
      });
   });
   console.log("✅ Exit point: app.get('/api/session-user')");                                                    //debugging
});


/////////////////////////////////////////////////////////////////
// --- User Logout (called from dashboard.html)
/////////////////////////////////////////////////////////////////
app.get('/logout', (req, res) => {
   console.log("⚡ Entry point: app.get('/logout')")                                                              //debugging
   req.session.destroy(() => {
      res.redirect('/index.html');
   });
   console.log("✅ Exit point: app.get('/logout')");                                                              //debugging
});


/////////////////////////////////////////////////////////////////
// --- User Registration (called from register.html)
/////////////////////////////////////////////////////////////////
app.post('/register', (req, res) => {
   console.log("⚡ Entry point: app.post('/register')")                                                           //debugging
   const { username, email, phone, password } = req.body;
   const encEmail = encrypt(email);
   const encPhone = encrypt(phone);
   //console.log('Decrypted email: ', decrypt(encEmail))                                                         //debugging
   //console.log('Decrypted phone: ', decrypt(encPhone))                                                         //debugging

   bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.sendStatus(500);
      db.run(
         `INSERT INTO users (username, email, phone, password_hash)
         VALUES (?, ?, ?, ?)`,
         [username, encEmail, encPhone, hash],
         function(err) {
            if (err) {
               console.error('Registration error:', err);
               return res.redirect('/register.html?error=exists');
            }
            req.session.user_id = this.lastID;
            req.session.user_type_id = 3;       // general user - newly added
            res.redirect('/dashboard.html');
         }
      );   //db.run
   });   //bcrypt.hash
   console.log("✅ Exit point: app.post('/register')")                                                            //debugging
});


/*********************************************************************************************************************************************************/
// --- Hazard Reporting Dashboard APIs
/*********************************************************************************************************************************************************/

////////////////////////////////////////////////////////////////////
// --- Fetch ALL road hazards within a given radius (.env.RADIUS)
// --- Called by loadHazards() in dashboard.html
////////////////////////////////////////////////////////////////////
app.post('/fetch/hazards', (req, res) => {
   console.log("⚡ Entry point: app.post('/fetch/hazards')")                                                      //debugging
   //console.log('req.body: ', req.body)                                                                         //debugging
   const { lat, lng } = req.body; 
   //const radius = 0.5;   // in Km (500 m)                                                                      //debugging-now parameterized
   //const radius = 5.0;   // in Km (1000 m)
   const query = `
      SELECT *, distance FROM (
         SELECT
            h.*,
            t.hazard_name,
            s.severity_name,
            r.status_name,
            6371 * acos(
            cos(radians(?)) * cos(radians(h.latitude)) *
            cos(radians(h.longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(h.latitude))
            ) AS distance
         FROM road_hazards h
         JOIN road_hazard_type t ON h.hazard_type_id = t.hazard_id
         JOIN road_hazard_severity s ON h.user_severity_id = s.severity_id
         JOIN road_hazard_status r ON h.hazard_status_id = r.status_id
         WHERE h.hazard_status_id NOT in (5, 6)
      ) AS sub
      WHERE distance <= ?
      ORDER BY distance ASC`;

   //console.log('Parameters: ', lat, lng, RADIUS);                                                               //debugging
   db.all(query, [lat, lng, lat, RADIUS], (err, rows) => {
      if (err) {
         console.error('DB Error:', err);
         return res.status(500).json({ error: err.message });
      }
      res.json(rows);
      //console.log(rows);                                                                                        //debugging
   });
   console.log("✅ Exit point: app.post('/fetch/hazards')")                                                       //debugging
});


////////////////////////////////////////////////////////////////////
// --- Fetch ALL road hazards
// --- Called by loadAllHazards() in dashboard.html, initMap() in map.html
////////////////////////////////////////////////////////////////////
app.get('/fetch/allhazards', (req, res) => {
   console.log("⚡ Entry point: app.get('/fetch/allhazards')")                                                    //debugging
   const query = `
      SELECT
         h.hazard_id,
         h.hazard_desc,
         h.hazard_image,
         h.latitude,
         h.longitude,
         h.vote_count,
         h.flag_count,
         h.user_severity_id,
         h.created_at,
         t.hazard_name,
         s.severity_name,
         r.status_name
      FROM road_hazards h
      JOIN road_hazard_type t ON h.hazard_type_id = t.hazard_id
      JOIN road_hazard_severity s ON h.user_severity_id = s.severity_id
      JOIN road_hazard_status r ON h.hazard_status_id = r.status_id
      WHERE h.hazard_status_id NOT in (5, 6)
      ORDER BY h.created_at DESC`;

   db.all(query, [], (err, rows) => {
      if (err) {
         console.error('DB Select Error', err);
         return res.status(500).send('Database Select Error');
      }
      res.json(rows);
   });
   console.log("✅ Exit point: app.get('/fetch/allhazards')")                                                     //debugging
});


/////////////////////////////////////////////////////////////////
// --- Report a Road Hazard
// --- Called from function renderGrid(list) in dashboard.html
/////////////////////////////////////////////////////////////////
app.post('/report-hazard', upload.single('hazard_image'), (req, res) => {
   console.log("⚡ Entry point: app.post('/report-hazard')")                                                      //debugging
   if (!req.session.user_id) {
      console.error('Unauthorized: no session');
      return res.status(401).send('You must be logged in');
   }
   if (!req.file) {
      console.error('No file present on req.file');
      return res.status(400).send('Image upload is required');
   }

   const {
      hazard_desc,
      hazard_type_id,
      user_severity_id,
      latitude,
      longitude
   } = req.body;

   const imageUrl = '/uploads/' + req.file.filename;
   const params = [
      hazard_desc,
      imageUrl,
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(hazard_type_id, 10),
      1,                                                                                                         // default value: 1 (Received/UnderReview)
      req.session.user_id,
      parseInt(user_severity_id, 10)
   ];

   const sql = `
      INSERT INTO road_hazards (hazard_desc, hazard_image, latitude, longitude, hazard_type_id, hazard_status_id, user_id, user_severity_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

   db.run(sql, params, function(err) {
      if (err) {
         console.error('DB INSERT error:', err);
         return res.status(500).send('Database error: ' + err.message);
      }
      res.json({ hazard_id: this.lastID });
   });
   console.log("✅ Exit point: app.post('/report-hazard')")                                                       //debugging
});


/////////////////////////////////////////////////////////////////
// --- Upvote a Reported Road Hazard
// --- Called from function renderGrid(list) in dashboard.html
/////////////////////////////////////////////////////////////////
app.post('/upvote-hazard', (req, res) => {
   console.log("⚡ Entry point: app.post('/upvote-hazard')")                                                      //debugging
   const voterId = req.session.user_id;
   const hazardId = req.body.hazard_id;

   if (!voterId) {
      return res.status(401).send('Login required.');
   }
   //console.log('REQ session:', req.session, req.body);                                                          //debugging

   db.serialize(() => {
      // 1) Get hazard owner, votes, status, AND severity
      console.log('# 1)');                                                                                        //debugging
      db.get(`
         SELECT user_id, hazard_desc, vote_count, hazard_status_id, user_severity_id
         FROM road_hazards
         WHERE hazard_id = ?`,
         [hazardId], (err, hazard) => {
            if (err) {
               console.error('Error fetching hazard:', err);
               return res.status(500).send('Server error');
            }
            if (!hazard) {
               return res.status(404).send('Hazard not found');
            }
        
            // 1) No self‐voting
            if (hazard.user_id === voterId) {
               return res.status(403).send('You cannot upvote your own report.');
            }

            // 2) Up-vote limit: how many votes in the last 24h?
            console.log('# 2)');                                                                                  //debugging
            db.get(`
               SELECT COUNT(*) AS cnt
               FROM road_hazard_votes
               WHERE user_id = ?
               AND created_at >= datetime('now','-1 day')`,
               [voterId], (err, row) => {
                  if (err) {
                     console.error('Error checking upvote‐limit:', err);
                     return res.status(500).send('Server error');
                  }
                  if (row.cnt >= DAILY_UPVOTE_LIMIT) {
                     return res.status(429).send(`Upvote limit exceeded (${DAILY_UPVOTE_LIMIT}/24h)`);
                  }

                  // 3) Try to insert the vote (UNIQUE enforces one per user/hazard)
                  console.log('# 3)');                                                      //debugging
                  db.run(`
                    INSERT OR IGNORE INTO road_hazard_votes (hazard_id, user_id)
                    VALUES (?, ?)`,
                    [hazardId, voterId],
                    function(err) {
                        if (err) {
                          console.error('INSERT upvote failed:', err);
                          return res.status(500).send('Database error');
                        }
                        if (this.changes === 0) {
                          // road user already voted
                          return res.status(403).send('You already voted.');
                        }

                        // 4) Increment the vote_count
                        console.log('# 4)');                                                                      //debugging
                        db.run(`
                           UPDATE road_hazards
                           SET vote_count = vote_count + 1
                           WHERE hazard_id = ?`,
                           [hazardId], err => {
                              if (err) {
                                 console.error('UPDATE vote_count failed:', err);
                                 return res.status(500).send('Database error');
                              }

                              // 5) Read updated count + status
                              console.log('# 5)');                                                                //debugging
                              db.get(`
                                 SELECT vote_count, hazard_status_id, user_severity_id
                                 FROM road_hazards
                                 WHERE hazard_id = ?`,
                                 [hazardId], (err, updated) => {
                                    if (err || !updated) {
                                       console.error('SELECT updated failed:', err);
                                       return res.status(500).send('Database error');
                                    }

                                    const vc = updated.vote_count;
                                    const statusWasUnderReview = updated.hazard_status_id === 1;
                                    const reachedThreshold = vc >= Number(UPVOTE_THRESHOLD);
                                    const isCritical = updated.user_severity_id === 5;

                                    // 6) Auto‐verify if upvote threshold reached & still UnderReview (status_id=1)
                                    if (statusWasUnderReview && reachedThreshold) {
                                       console.log('# 6)');                                                      //debugging
                                       // pick the right status label
                                       const nextStatusType = isCritical ? 'Authority Notified' : 'Community Verified';
                                       
                                       // lookup the “Community Verified” status_id
                                       db.get(`
                                          SELECT status_id FROM road_hazard_status
                                          WHERE status_name = ?`,
                                          [ nextStatusType ], (err, st) => {
                                             if (err) {
                                                console.error('SELECT failed fetching status_id for', nextStatusType, err);
                                                return res.status(500).send('Database error');
                                             }
                                             
                                             if (!st || !st.status_id) {
                                                console.warn(`No status row found for "${nextStatusType}"`);
                                                // fallback: just emit vote update
                                                io.emit('vote-updated', { hazard_id: hazardId, vote_count: vc });
                                                return res.json({ vote_count: vc, verified: true });
                                             }
                                             
                                             // update the road hazard with new status + timestamp
                                             db.run(`
                                                UPDATE road_hazards
                                                SET hazard_status_id = ?, updated_at = CURRENT_TIMESTAMP
                                                WHERE hazard_id = ?`,
                                                [st.status_id, hazardId], err => {
                                                   if (err) {
                                                      console.error('UPDATE failed setting status to "${nextStatusType}"', err);
                                                      return res.status(500).send('Database error');
                                                   }
                                                        
                                                   io.emit('status-updated', {
                                                      hazard_id: hazardId,
                                                      //hazard_status_id: st.status_id
                                                      hazard_status: nextStatusType
                                                   });
                                                   
                                                   // Send email notification IF critical and meets the UPVOTE_THRESHOLD
                                                   //console.log(SMTP_USER);                                        //debugging
                                                   //console.log(SMTP_PASS);                                        //debugging
                                                   //console.log(ALERT_EMAIL);                                      //debugging
                                                   if (isCritical && ALERT_EMAIL) {
                                                      const mailOptions = {
                                                         from: SMTP_USER,
                                                         to: ALERT_EMAIL,
                                                         subject: '🚨 Critical Road Hazard Alert from SafeRoads Navigator',
                                                         text: `Critical hazard <${hazardId}><${hazard.hazard_desc}> has just been community-verified and requires attention.`
                                                      };
                                                   
                                                      transporter.sendMail(mailOptions, (error, info) => {
                                                         if (error) {
                                                            console.log(error);
                                                         } else {
                                                            console.log('Email sent: ' + info.response);
                                                         }
                                                      });
                                                   }
      
                                                   //io.emit('refresh-hazards');
                                                   io.emit('vote-updated', {
                                                      hazard_id: hazardId,
                                                      vote_count: vc
                                                   });
                                                      
                                                   res.json({
                                                      vote_count: vc,
                                                      verified: true
                                                   });
                                                }
                                             );
                                          }
                                       );
                                    } else {
                                       // below threshold: just emit vote‐updated
                                       io.emit('vote-updated', {
                                          hazard_id: hazardId,
                                          vote_count: vc 
                                       });
                                       res.json({ vote_count: vc });
                                    }
                                 }
                              );   // end 5) db.get
                           }
                        );   // end 4) db.run
                     }
                  );   // end 3) db.run
               }
            );   // end 2) db.get
         }
      );   // end 1) db.get
   });   // end db.serialize
   console.log("✅ Exit point: app.post('/upvote-hazard')")                                                       //debugging
});


/////////////////////////////////////////////////////////////////
// --- Flag a Reported Road Hazard
// --- Called from function renderGrid(list) in hazards.html
/////////////////////////////////////////////////////////////////
app.post('/flag-hazard', (req, res) => {
   console.log("⚡ Entry point: app.post('/flag-hazard')")                                                        //debugging
   const userId   = req.session.user_id;
   const hazardId = req.body.hazard_id;
   const reason   = req.body.reason || null;

   if (!userId) {
      return res.status(401).send('Login required');
   }

   // 1) Make sure they’re not flagging their own report
   db.get(
      `SELECT user_id FROM road_hazards WHERE hazard_id = ?`,
      [hazardId], (err, row) => {
         if (err) {
            console.error('Error fetching hazard owner:', err);
            return res.status(500).send('Server error');
         }
         if (!row) {
            return res.status(404).send('Hazard not found');
         }
         if (row.user_id === userId) {
            return res.status(403).send('You cannot flag your own report');
         }

         // 2) Insert the flag if not already done
         db.run(
            `INSERT OR IGNORE INTO road_hazard_flags (hazard_id, user_id, reason)
            VALUES (?, ?, ?)`,
            [hazardId, userId, reason],
            function(err) {
               if (err) {
                  console.error('Flag insert error:', err);
                  return res.status(500).send('Database error');
               }
               if (this.changes === 0) {
                  return res.status(409).send('Already flagged');
               }

               // 3) Update the flag_count
               db.run(
                  `UPDATE road_hazards
                  SET flag_count = flag_count + 1
                  WHERE hazard_id = ?`,
                  [hazardId], err => {
                     if (err) console.error('Flag count update error:', err);
                     io.emit('flag-updated', { hazard_id: hazardId });
                     res.sendStatus(200);
                  }
               );
            }
         );
      }
   );
   console.log("✅ Exit point: app.post('/flag-hazard')")                                                         //debugging
});


/*********************************************************************************************************************************************************/
// --- Hazard Moderation Dashboard APIs
/*********************************************************************************************************************************************************/

/////////////////////////////////////////////////////////////////
// --- Show all hazard reports to Admin
// --- Called from function loadPending() in dashboard.html
/////////////////////////////////////////////////////////////////
app.get('/admin/load-hazards', (req, res) => {
   console.log("⚡ Entry point: app.get('/admin/load-hazards')")                                                  //debugging

   if (!req.session.user_id || (req.session.user_type_id !== 2 && req.session.user_type_id !== 1)) {
      return res.status(403).send('Forbidden');
   }

   let sort = req.query.sort || 'flags';
   let orderBy = 'r.flag_count DESC';
   if (sort === 'upvotes') orderBy = 'r.vote_count DESC';
   else if (sort === 'severity') orderBy = 'r.user_severity_id DESC';
   else if (sort === 'status') orderBy = 'r.hazard_status_id DESC';

   const query = `
      SELECT r.*, s.hazard_name, t.status_name, u.severity_name
      FROM road_hazards r
      JOIN road_hazard_status t ON r.hazard_status_id = t.status_id
      JOIN road_hazard_type s ON r.hazard_type_id = s.hazard_id
      JOIN road_hazard_severity u ON r.user_severity_id = u.severity_id
      WHERE r.hazard_status_id NOT in (5, 6)
      ORDER BY ${orderBy}, r.created_at DESC
   `;

   db.all(query, [], (err, rows) => {
      if (err) return res.status(500).send(err.message);
      res.json(rows);
      //console.log(rows);                                                                                        //debugging
   });
   console.log("✅ Exit point: app.get('/admin/load-hazards')")                                                   //debugging
});


/////////////////////////////////////////////////////////////////
// --- Approve a Road Hazard Report
// --- Called from function bindApprovalButtons() in dashboard.html
/////////////////////////////////////////////////////////////////
app.post('/admin/approve-hazard', (req, res) => {
   console.log("⚡ Entry point: app.post('/admin/approve-hazard')")                                               //debugging
   if (!req.session.user_id || (req.session.user_type_id !== 1 && req.session.user_type_id !== 2)) {
      return res.status(403).send('Forbidden');
   }
  
   const hazardId = req.body.hazard_id;
   const comment = (req.body.comment || '').trim();

   // 1) Look up the current hazard status
   db.get(`
      SELECT hazard_status_id
      FROM road_hazards
      WHERE hazard_id = ?`,
      [hazardId], (err, row) => {
         if (err) {
            console.error('Error fetching hazard status: ', err);
            return res.status(500).send('Database error');
         }
         if (!row) {
            return res.status(404).send('Hazard not found');
         }
         const currStatus = row.hazard_status_id;
         let newStatus = null;

         // 2) If hazard_status_id is 2 (Community Verified) or 3 (Authority Verified), set to 4 (Scheduled)
         if (currStatus === 1 || currStatus === 2 || currStatus === 3) {
            newStatus = 4;
         }
         else if (currStatus === 4) {                  // if status is 4 (Scheduled), set to 5 (Resolved)
            newStatus = 5;
         } else {
            return res.status(400).send('Cannot advance status from ' + currStatus);
         }

         // 3) Update status + updated_at
         db.run(`
            UPDATE road_hazards
            SET hazard_status_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE hazard_id = ?`,
            [newStatus, hazardId], err => {
               if (err) {
                  console.error('Error updating hazard status:', err);
                  return res.status(500).send('Database error');
               }
               // 4) Insert moderation record (for approval)
               db.run(`
                  INSERT INTO road_hazard_moderation (hazard_id, auth_id, auth_action, auth_comments)
                  VALUES (?, ?, 'Approve', ?)`,
                  [hazardId, req.session.user_id, comment],
                  modErr => {
                     if (modErr) {
                        console.error('Error saving moderation comment:', modErr);
                     }
                     // 5) Trigger a real-time status-updated event so frontends can refresh
                     if (newStatus === 4) {
                        //console.log('status-updated', newStatus);                                               //debugging
                        io.emit('status-updated', {
                           hazard_id: hazardId,
                           hazard_status: 'Scheduled'
                        });
                     } else if (newStatus === 5) {
                        //console.log('hazard-approved', newStatus);                                                    //debugging
                        io.emit('hazard-approved', {
                           hazard_id: hazardId,
                           hazard_status_id: newStatus
                        });
                     }
                     res.sendStatus(200);
                  }
               );
            }
         );
      }
   );
   console.log("✅ Exit point: app.post('/admin/approve-hazard')"); //debugging
});
/*
app.post('/admin/approve-hazard', (req, res) => {
   console.log("⚡ Entry point: app.post('/admin/approve-hazard')")                                               //debugging

   if (!req.session.user_id || (req.session.user_type_id !== 1 && req.session.user_type_id !== 2)) {
      return res.status(403).send('Forbidden');
   }
   const hazardId = req.body.hazard_id;

   // 1) Look up the current hazard status
   db.get(`
      SELECT hazard_status_id
      FROM road_hazards
      WHERE hazard_id = ?`,
      [hazardId], (err, row) => {
         if (err) {
            console.error('Error fetching hazard status: ', err);
            return res.status(500).send('Database error');
         }
         if (!row) {
            return res.status(404).send('Hazard not found');
         }

         const currStatus = row.hazard_status_id;
         let newStatus = null;

         // 2) If hazard_status_id is 2 (Community Verified) or 3 (Authority Verified), set to 4 (Scheduled)
         if (currStatus === 1 || currStatus === 2 || currStatus === 3) {
            newStatus = 4;
         }
         else if (currStatus === 4) {                  // if status is 4 (Scheduled), set to 5 (Resolved)
            newStatus = 5;
         } else {
            return res.status(400).send('Cannot advance status from ' + currStatus);
         }

         // 3) Update status + updated_at
         db.run(`
            UPDATE road_hazards
            SET hazard_status_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE hazard_id = ?`,
            [newStatus, hazardId], err => {
               if (err) {
                  console.error('Error updating hazard status:', err);
                  return res.status(500).send('Database error');
               }
               // 5) Trigger a real-time status-updated event so frontends can refresh
               if (newStatus === 4) {
                  //console.log('status-updated', newStatus);                                                     //debugging
                  io.emit('status-updated', {
                     hazard_id: hazardId,
                     hazard_status: 'Scheduled'
                  });
               } else if (newStatus === 5) {
                  //console.log('hazard-approved', newStatus);                                                    //debugging
                  io.emit('hazard-approved', {
                     hazard_id: hazardId,
                     hazard_status_id: newStatus
                  });
               }
               res.sendStatus(200);
            }
         );
      }
   );
   console.log("✅ Exit point: app.post('/admin/approve-hazard')")                                                //debugging
});
*/


/////////////////////////////////////////////////////////////////
// --- Reject a Road Hazard Report
// --- Called from function bindApprovalButtons() in dashboard.html
/////////////////////////////////////////////////////////////////
app.post('/admin/reject-hazard', (req, res) => {
   console.log("⚡ Entry point: app.post('/admin/reject-hazard')")                                                //debugging
   if (!req.session.user_id || (req.session.user_type_id !== 1 && req.session.user_type_id !== 2)) {
      return res.status(403).send('Forbidden');
   }
  
   const { hazard_id, comment } = req.body;
   if (!comment || !comment.trim()) {
      return res.status(400).send('Rejection reason is required.');
   }
   db.run(`
      UPDATE road_hazards 
      SET hazard_status_id = 6, updated_at = CURRENT_TIMESTAMP
      WHERE hazard_id = ?`,
      [hazard_id], err => {
         if (err) {
            console.error('Error updating hazard status:', err);
            return res.status(500).send('Database error');
         }
         // Insert moderation record (for rejection)
         db.run(`
            INSERT INTO road_hazard_moderation (hazard_id, auth_id, auth_action, auth_comments)
            VALUES (?, ?, 'Reject', ?)`,
            [hazard_id, req.session.user_id, comment.trim()],
            modErr => {
               if (modErr) {
                  console.error('Error saving moderation comment:', modErr);
               }
               io.emit('hazard-rejected', {
                  hazard_id: hazard_id,
                  hazard_status_id: 6
               });
               res.sendStatus(200);
            }
         );
      }
   );
   console.log("✅ Exit point: app.post('/admin/reject-hazard')");                                                //debugging
});
/*
app.post('/admin/reject-hazard', (req, res) => {
   console.log("⚡ Entry point: app.post('/admin/reject-hazard')")                                                //debugging
   if (!req.session.user_id || (req.session.user_type_id !== 1 && req.session.user_type_id !== 2)) {
      return res.status(403).send('Forbidden');
   }
   const { hazard_id } = req.body;
   db.run(`
      UPDATE road_hazards 
      SET hazard_status_id = 6, updated_at = CURRENT_TIMESTAMP
      WHERE hazard_id = ?`,
      [hazard_id], err => {
         if (err) {
            console.error('Error updating hazard status:', err);
            return res.status(500).send('Database error');
         }
         io.emit('hazard-rejected', {
            hazard_id: hazard_id,
            hazard_status_id: 6
         });
         res.sendStatus(200);
      }
   );
   console.log("✅ Exit point: app.post('/admin/reject-hazard')")                                                 //debugging
});
*/


/*********************************************************************************************************************************************************/
// --- Analytics Dashboard APIs
/*********************************************************************************************************************************************************/

/////////////////////////////////////////////////////////////////
// --- Miscellaneous functions for /api/analytics API
/////////////////////////////////////////////////////////////////
function dbAllAsync(sql, params = []) {
   return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
         if (err) reject(err);
         else resolve(rows);
      });
   });
}

function dbGetAsync(sql, params = []) {
   return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
         if (err) reject(err);
         else resolve(row);
      });
   });
}


/////////////////////////////////////////////////////////////////
// --- Get all analytics in one API
// --- Called from frunction renderAnalytics()
/////////////////////////////////////////////////////////////////
app.get('/api/analytics', async (req, res) => {
   console.log("⚡ Entry point: app.post('/api/analytics')")                                                      //debugging
   
   if (!req.session.user_id || (req.session.user_type_id !== 1 && req.session.user_type_id !== 2)) {
      return res.status(403).send('Forbidden');
   }

   try {
      // Hazard Volume & Frequency Analytics (high-level stats)
      const { total } = await dbGetAsync('SELECT COUNT(*) AS total FROM road_hazards');
      const { last7 } =  await dbGetAsync('SELECT COUNT(*) as last7 FROM road_hazards WHERE created_at >= DATE("now", "-7 days")');
      const { last30 } =  await dbGetAsync('SELECT COUNT(*) as last30 FROM road_hazards WHERE created_at >= DATE("now", "-30 days")');
      const avgRow =  await dbGetAsync('SELECT AVG(cnt) as avgDaily FROM (SELECT COUNT(*) as cnt FROM road_hazards GROUP BY DATE(created_at))');
      const avgDaily = avgRow.avgDaily ? avgRow.avgDaily.toFixed(2) : "0";
      const avgres = await dbGetAsync('SELECT AVG(julianday(updated_at) - julianday(created_at)) as avgRes FROM road_hazards WHERE hazard_status_id = 5;');
      const avgRows = avgres.avgRes ? avgres.avgRes.toFixed(2) : "0";

      //////////////////////////////////////////////
      // --- Hazard Classification Analytics
      //////////////////////////////////////////////
      // Hazards by Type
      const typeRows = await dbAllAsync(`
         SELECT t.hazard_name, COUNT(*) as count
         FROM road_hazards h
         JOIN road_hazard_type t ON h.hazard_type_id = t.hazard_id
         GROUP BY h.hazard_type_id
         ORDER BY count DESC;
      `);
      const type = {
         labels: typeRows.map(r => r.hazard_name),
         counts: typeRows.map(r => r.count)
      };

      // Hazard by Status
      const statusRows = await dbAllAsync(`
         SELECT s.status_name, COUNT(*) as count
         FROM road_hazards h
         JOIN road_hazard_status s ON h.hazard_status_id = s.status_id
         GROUP BY h.hazard_status_id
         ORDER BY count DESC;
      `);
      const status = {
         labels: statusRows.map(r => r.status_name),
         counts: statusRows.map(r => r.count)
      };

      // Hazards by Severity
      const severityRows = await dbAllAsync(`
         SELECT s.severity_name, COUNT(*) as count
         FROM road_hazards h
         JOIN road_hazard_severity s ON h.user_severity_id = s.severity_id
         GROUP BY h.user_severity_id
         ORDER BY count DESC;
      `);
      const severity = {
         labels: severityRows.map(r => r.severity_name),
         counts: severityRows.map(r => r.count)
      };

      //////////////////////////////////////////////
      // --- Location-Based Analytics
      //////////////////////////////////////////////
      // Hazard Density Map
      const mapRows = await dbAllAsync('SELECT latitude AS lat, longitude AS lng FROM road_hazards');
      const map = {
         points: mapRows,
         centerLat: mapRows.length ? mapRows.reduce((sum, r) => sum + r.lat, 0) / mapRows.length : -36.8485, // Default Auckland
         centerLng: mapRows.length ? mapRows.reduce((sum, r) => sum + r.lng, 0) / mapRows.length : 174.7633
      };

      // Top 10 Hazardous Areas (clustering by rounded coordinates)
      const topLocations = await dbAllAsync(`
         SELECT ROUND(latitude, 2) as lat, ROUND(longitude, 2) as lng, COUNT(*) as count
         FROM road_hazards
         GROUP BY lat, lng
         ORDER BY count DESC
         LIMIT 10;
      `);

      //////////////////////////////////////////////
      // --- User Engagement Analytics
      //////////////////////////////////////////////
      // Most Upvoted Hazards
      const topVoted = await dbAllAsync(`
         SELECT hazard_desc, vote_count
         FROM road_hazards
         ORDER BY vote_count DESC
         LIMIT 10;
      `);

      // Most Flagged Hazards
      const topFlagged = await dbAllAsync(`
         SELECT hazard_desc, flag_count
         FROM road_hazards
         ORDER BY flag_count DESC
         LIMIT 10;
      `);

      // Top Reporting Users
      const topUsers = await dbAllAsync(`
         SELECT u.username, COUNT(*) as report_count
         FROM road_hazards h
         JOIN users u ON h.user_id = u.user_id
         GROUP BY h.user_id
         ORDER BY report_count DESC
         LIMIT 10;
      `);

      //////////////////////////////////////////////
      // --- Trends & Insights
      //////////////////////////////////////////////
      // Hazard Reporting Trend over last 30 days
      const trendsRows = await dbAllAsync(`
         SELECT DATE(created_at) as date, COUNT(*) as count
         FROM road_hazards
         WHERE created_at >= DATE('now', '-30 days')
         GROUP BY date
         ORDER BY date;
      `);
      const trends = {
         labels: trendsRows.map(r => r.date),
         counts: trendsRows.map(r => r.count)
      };

      // Spikes/Anomalies (days with hazards reported > mean + stddev)
      const mean = trends.counts.length
         ? trends.counts.reduce((a, b) => a + b, 0) / trends.counts.length
         : 0;
      // standard deviation (a measure of spread/variability) of the values by:
      // 1) dividing the sum of squared differences by the number of elements (i.e. the variance), and
      // 2) taking the square root of the variance
      const stddev = trends.counts.length
         ? Math.sqrt(trends.counts.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / trends.counts.length)
         : 0;
      // basic anomaly detection method: points above this threshold (one standard deviation above the mean) are considered unusually high and thus "anomalous"
      const anomalies = trendsRows.filter(r => r.count > mean + stddev);

      // Respond with all analytics data
      res.json({
         overview: { total, last7, last30, avgDaily, avgRows },
         type,
         status,
         severity,
         map,
         topLocations,
         topVoted,
         topFlagged,
         topUsers,
         trends: {
            labels: trends.labels,
            counts: trends.counts,
            anomalies: anomalies.map(a => ({ date: a.date, count: a.count }))
         }
      });
      //console.log('ANALYTICS DATA: ', anomalies)                                                                //debugging
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
   }
   console.log("✅ Exit point: app.post('/api/analytics')")                                                       //debugging
});


/*********************************************************************************************************************************************************/
// --- Maintenance Dashboard APIs
/*********************************************************************************************************************************************************/

/////////////////////////////////////////////////////////////////
// --- User Maintenance
/////////////////////////////////////////////////////////////////

// --- 1. Get users from database
app.get('/api/users', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/users')")                                                           //debugging

   db.all(`SELECT user_id, username, '************' as email1, email, '**** **** **** ****' as phone1, phone, user_type_id FROM users`, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
   });
   console.log("✅ Exit point: app.get('/api/users')")                                                            //debugging
});

// --- 2. Get user types from database
app.get('/api/user-types', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/user-types')")                                                      //debugging
   db.all('SELECT user_type_id, user_type_name FROM user_type', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
   });
   console.log("✅ Exit point: app.get('/api/user-types')")                                                       //debugging
});

// --- 3. Save new user
app.post('/api/users', async (req, res) => {
   console.log("⚡ Entry point: app.post('/api/users')")                                                          //debugging
   const { username, email, phone, password, user_type_id } = req.body;

   const encEmail = encrypt(email);
   const encPhone = encrypt(phone);

   if (!username || !email || !password || !user_type_id) return res.status(400).json({ error: "Missing fields" });
   const password_hash = await bcrypt.hash(password, 10);
   db.run(
      'INSERT INTO users (username, email, phone, password_hash, user_type_id) VALUES (?, ?, ?, ?, ?)',
      [username, encEmail, encPhone, password_hash, user_type_id],
      function (err) {
         if (err) return res.status(500).json({ error: err.message });
         res.json({ user_id: this.lastID });
      }
   );
   console.log("✅ Exit point: app.post('/api/users')")                                                           //debugging
});

// --- 4. Get details of user to be editted
app.get('/api/users/:id', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/users/:id')")                                                       //debugging
   db.get('SELECT user_id, username, email, phone, user_type_id FROM users WHERE user_id=?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'User not found' });
      row.email = decrypt(row.email);
      row.phone = decrypt(row.phone);
      res.json(row);
   });
   console.log("✅ Exit point: app.get('/api/users/:id')")                                                        //debugging
});

// --- 5. Save editted user
app.put('/api/users/:id', async (req, res) => {
   console.log("⚡ Entry point: app.put('/api/users/:id')")                                                       //debugging
   const id = req.params.id;
   const { username, email, phone, user_type_id } = req.body;
   const encEmail = encrypt(email);
   const encPhone = encrypt(phone);
   if (req.body.password && req.body.password.trim() !== '') {
      const password = req.body.password;
      bcrypt.hash(password, 10, (err, hash) => {
         if (err) return res.status(500).json({ error: 'Error hashing password' });
         db.run(`
            UPDATE users SET username=?, email=?, phone=?, password_hash=?, user_type_id=? WHERE user_id=?`,
            [username, encEmail, encPhone, hash, user_type_id, id],
            function (err) {
               if (err) return res.status(500).json({ error: 'Database error' });
               res.json({ success: true, updated: this.changes });
            }
         );
      });
   } else {
      db.run(`
         UPDATE users SET username=?, email=?, phone=?, user_type_id=? WHERE user_id=?`,
         [username, encEmail, encPhone, user_type_id, id],
         function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ success: true, updated: this.changes });
         }
      );
   }
   console.log("✅ Exit point: app.put('/api/users/:id')")                                                        //debugging
});

// --- 6. Delete selected user
app.delete('/api/users/:id', (req, res) => {
   console.log("⚡ Entry point: app.delete('/api/users/:id')")                                                    //debugging
   db.run('DELETE FROM users WHERE user_id=?', [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
   });
   console.log("✅ Exit point: app.delete('/api/users/:id')")                                                     //debugging
});


/////////////////////////////////////////////////////////////////
// --- Road Hazard Class Maintenance
/////////////////////////////////////////////////////////////////

// --- 1. Get road hazard classes from database
app.get('/api/classes', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/classes')")                                                         //debugging
   db.all('SELECT class_id, class_name, class_desc FROM road_hazard_class', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
   });
   console.log("✅ Exit point: app.get('/api/classes')")                                                          //debugging
});

// --- 2. Save new road hazard class
app.post('/api/classes', (req, res) => {
   console.log("⚡ Entry point: app.post('/api/classes')")                                                        //debugging
   const { class_name, class_desc } = req.body;
   if (!class_name) return res.status(400).json({ error: "Missing class_name" });
   db.run(
      'INSERT INTO road_hazard_class (class_name, class_desc) VALUES (?, ?)',
      [class_name, class_desc],
      function (err) {
         if (err) return res.status(500).json({ error: err.message });
         res.json({ class_id: this.lastID });
      }
   );
   console.log("✅ Exit point: app.post('/api/classes')")                                                         //debugging
});

// --- 3. Get details of road hazard class to be editted
app.get('/api/classes/:id', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/classes/:id')")                                                     //debugging
   db.get('SELECT class_id, class_name, class_desc FROM road_hazard_class WHERE class_id=?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
   });
   console.log("✅ Exit point: app.get('/api/classes/:id')")                                                      //debugging
});

// --- 4. Save editted road hazard class
app.put('/api/classes/:id', (req, res) => {
   console.log("⚡ Entry point: app.put('/api/classes/:id')")                                                     //debugging
   const { class_name, class_desc } = req.body;
   db.run(
      'UPDATE road_hazard_class SET class_name=?, class_desc=? WHERE class_id=?',
      [class_name, class_desc, req.params.id],
      function (err) {
         if (err) return res.status(500).json({ error: err.message });
         res.json({ changes: this.changes });
      }
   );
   console.log("✅ Exit point: app.put('/api/classes/:id')")                                                      //debugging
});

// --- 5. Delete selected road hazard class
app.delete('/api/classes/:id', (req, res) => {
   console.log("⚡ Entry point: app.delete('/api/classes/:id')")                                                  //debugging
   db.run('DELETE FROM road_hazard_class WHERE class_id=?', [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
   });
   console.log("✅ Exit point: app.delete('/api/classes/:id')")                                                   //debugging
});


/////////////////////////////////////////////////////////////////
// --- Road Hazard Type Maintenance
/////////////////////////////////////////////////////////////////

// --- 1. Get road hazard types from database
app.get('/api/types', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/types')")                                                           //debugging
   db.all('SELECT hazard_id, hazard_name, hazard_desc, class_id FROM road_hazard_type', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
   });
   console.log("✅ Exit point: app.get('/api/types')")                                                            //debugging
});

// --- 2. Save new road hazard type
app.post('/api/types', (req, res) => {
   console.log("⚡ Entry point: app.post('/api/types')")                                                          //debugging
   const { hazard_name, hazard_desc, class_id } = req.body;
   if (!hazard_name || !class_id) return res.status(400).json({ error: "Missing fields" });
   db.run(
      'INSERT INTO road_hazard_type (hazard_name, hazard_desc, class_id) VALUES (?, ?, ?)',
      [hazard_name, hazard_desc, class_id],
      function (err) {
         if (err) return res.status(500).json({ error: err.message });
         res.json({ hazard_id: this.lastID });
      }
   );
   console.log("✅ Exit point: app.post('/api/types')")                                                           //debugging
});

// --- 3. Get details of road hazard type to be editted
app.get('/api/types/:id', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/types/:id')")                                                       //debugging
   db.get('SELECT hazard_id, hazard_name, hazard_desc, class_id FROM road_hazard_type WHERE hazard_id=?', [req.params.id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
   });
   console.log("✅ Exit point: app.get('/api/types/:id')")                                                        //debugging
});

// --- 4. Save editted road hazard type
app.put('/api/types/:id', (req, res) => {
   console.log("⚡ Entry point: app.put('/api/types/:id')")                                                       //debugging
   const { hazard_name, hazard_desc, class_id } = req.body;
   db.run(
      'UPDATE road_hazard_type SET hazard_name=?, hazard_desc=?, class_id=? WHERE hazard_id=?',
      [hazard_name, hazard_desc, class_id, req.params.id],
      function (err) {
         if (err) return res.status(500).json({ error: err.message });
         res.json({ changes: this.changes });
      }
   );
   console.log("✅ Exit point: app.put('/api/types/:id')")                                                        //debugging
});

// --- 5. Delete selected road hazard type
app.delete('/api/types/:id', (req, res) => {
   console.log("⚡ Entry point: app.delete('/api/types/:id')")                                                    //debugging
   db.run('DELETE FROM road_hazard_type WHERE hazard_id=?', [req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: this.changes });
   });
   console.log("✅ Exit point: app.delete('/api/types/:id')")                                                     //debugging
});



/*********************************************************************************************************************************************************/
// --- Reports Dashboard APIs
/*********************************************************************************************************************************************************/

/////////////////////////////////////////////////////////////////
// --- Get all hazard reports, grouped by ISO week number
// --- Called from function loadWeeklyReport()
/////////////////////////////////////////////////////////////////
app.get('/api/reports/weekly', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/reports/weekly')")                                                  //debugging
   db.all(`
      SELECT 
         strftime('%Y-%W', r.created_at) AS week,
         r.hazard_id, r.hazard_desc, r.latitude, r.longitude, s.hazard_name AS hazard_type, 
         t.status_name AS status, u.severity_name AS severity, r.user_id, date(r.created_at) as date_reported
      FROM road_hazards r
      JOIN road_hazard_type s ON r.hazard_type_id = s.hazard_id
      JOIN road_hazard_status t ON r.hazard_status_id = t.status_id
      JOIN road_hazard_severity u ON r.user_severity_id = u.severity_id
      ORDER BY week DESC, date_reported DESC, r.hazard_status_id DESC, r.user_severity_id DESC`, 
      (err, rows) => {
         if (err) return res.status(500).json({error: err.message});
         const grouped = {};
         rows.forEach(row => {
            if (!grouped[row.week]) grouped[row.week] = [];
            grouped[row.week].push(row);
         });
         res.json(grouped);
   });
   console.log("✅ Exit point: app.get('/api/reports/weekly')")                                                   //debugging
});


/////////////////////////////////////////////////////////////////
// --- Get all hazard reports, grouped by month
// --- Called from function loadMonthlyReport()
/////////////////////////////////////////////////////////////////
app.get('/api/reports/monthly', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/reports/monthly')")                                                 //debugging
   db.all(`
      SELECT 
         strftime('%Y-%m', r.created_at) AS month,
         r.hazard_id, r.hazard_desc, r.latitude, r.longitude, s.hazard_name AS hazard_type,
         t.status_name AS status, u.severity_name AS severity, r.user_id, date(r.created_at) as date_reported
      FROM road_hazards r
      JOIN road_hazard_type s ON r.hazard_type_id = s.hazard_id
      JOIN road_hazard_status t ON r.hazard_status_id = t.status_id
      JOIN road_hazard_severity u ON r.user_severity_id = u.severity_id
      ORDER BY month DESC, date_reported DESC, r.hazard_status_id DESC, r.user_severity_id DESC`, 
      (err, rows) => {
         if (err) return res.status(500).json({error: err.message});
         const grouped = {};
         rows.forEach(row => {
            if (!grouped[row.month]) grouped[row.month] = [];
            grouped[row.month].push(row);
         });
         res.json(grouped);
   });
   console.log("✅ Exit point: app.get('/api/reports/monthly')")                                                  //debugging
});


/////////////////////////////////////////////////////////////////
// --- Get all unresolved/open hazards
// --- Called from function loadUnresolvedReport()
/////////////////////////////////////////////////////////////////
app.get('/api/reports/unresolved', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/reports/unresolved')")                                              //debugging
   db.all(`
      SELECT 
         r.hazard_id, r.hazard_desc, r.latitude, r.longitude, s.hazard_name AS hazard_type, 
         t.status_name AS status, u.severity_name AS severity, r.user_id, date(r.created_at) as date_reported
      FROM road_hazards r
      JOIN road_hazard_type s ON r.hazard_type_id = s.hazard_id
      JOIN road_hazard_status t ON r.hazard_status_id = t.status_id
      JOIN road_hazard_severity u ON r.user_severity_id = u.severity_id
      WHERE r.hazard_status_id IN (SELECT status_id FROM road_hazard_status WHERE status_name NOT IN ('Resolved', 'Rejected'))
      ORDER BY date_reported DESC, r.hazard_status_id DESC, r.user_severity_id DESC`, 
      (err, rows) => {
         if (err) return res.status(500).json({error: err.message});
         res.json(rows);
         //console.log(rows);                                                                                     //debugging
   });
   console.log("✅ Exit point: app.get('/api/reports/unresolved')")                                               //debugging
});


/////////////////////////////////////////////////////////////////
// --- Resolution Rate by Hazard Type
// --- Called from function loadResolutionReport()
/////////////////////////////////////////////////////////////////
app.get('/api/reports/resolution-rate', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/reports/resolution-rate')")                                         //debugging
   db.all(`
      SELECT 
         t.hazard_name AS hazard_type,
         COUNT(r.hazard_id) AS total,
         SUM(CASE WHEN s.status_name = 'Resolved' THEN 1 ELSE 0 END) AS resolved,
         ROUND(100.0 * SUM(CASE WHEN s.status_name = 'Resolved' THEN 1 ELSE 0 END) / COUNT(r.hazard_id), 2) AS resolution_rate
      FROM road_hazards r
      JOIN road_hazard_type t ON r.hazard_type_id = t.hazard_id
      JOIN road_hazard_status s ON r.hazard_status_id = s.status_id
      GROUP BY t.hazard_name
      ORDER BY resolution_rate DESC`, 
      (err, rows) => {
         if (err) return res.status(500).json({error: err.message});
         res.json(rows);
   });
   console.log("✅ Exit point: app.get('/api/reports/resolution-rate')")                                          //debugging
});


/////////////////////////////////////////////////////////////////
// --- Resolved/Rejected Reports
// --- Called from function loadResolvedRejectedReport()
/////////////////////////////////////////////////////////////////
app.get('/api/reports/resolved-rejected', (req, res) => {
   console.log("⚡ Entry point: app.get('/api/reports/resolved-rejected')")                                       //debugging
   db.all(`
      SELECT
         r.hazard_id, r.hazard_desc, r.latitude, r.longitude, s.hazard_name AS hazard_type, t.status_name  AS status, 
         r.vote_count, r.flag_count, u.severity_name AS severity, r.user_id, date(r.created_at) as date_reported
      FROM road_hazards r
      JOIN road_hazard_type s ON r.hazard_type_id = s.hazard_id
      JOIN road_hazard_status t ON r.hazard_status_id = t.status_id
      JOIN road_hazard_severity u ON r.user_severity_id = u.severity_id
      WHERE t.status_name IN ('Resolved', 'Rejected')
      ORDER BY date_reported DESC, r.hazard_status_id DESC`,
      (err, rows) => {
         if (err) return res.status(500).json({ error: err.message });
         res.json(rows);
      });
   console.log("✅ Exit point: app.get('/api/reports/resolved-rejected')")                                        //debugging
});



/*********************************************************************************************************************************************************/
// --- Start Server
/*********************************************************************************************************************************************************/
//app.listen(PORT, () => {
server.listen(PORT, () => {
   console.log(`🚀 Server running at http://localhost:${PORT}`);
});
