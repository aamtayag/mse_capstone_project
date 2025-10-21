
# #####################################################
# ## Capstone Presentation
# #####################################################

### TODO on Presentation day
1. Open app in Chrome (aamtayag) and Safari (aamt)
2. Open email yoobeestud@gmail.com (Chrome)
3. Open google maps (Chrome)
4. Open Visio Capstone-Diagrams (Chrome)
5. Open Powerpoint presentation (Chrome)
6. Bring camera stand & charged batteries (2) - Ok
7. Laptop power cable - Ok
8. Ready some 4 coordinates for demo
   - Yoobee City Road: Level 4/3 City Road, Grafton, Auckland 1010; -36.857042, 174.764401
   - CIC North Shoare: 794 East Coast Road, Oteha, Auckland 0630; -36.721903, 174.723245
   - Beeston Crescent: 19B Beeston Crescent, Manurewa, Auckland 2102: -37.026610, 174.885707
   - Waitemata Station (Britomart): Auckland Central, Auckland 1010; about 1.7km away from Yoobee; -36.844084, 174.769174

### System Demo Flow
0. Users
      3|aries|1      - admin
      2|arnold|2     - admin support
      1|aamtayag|3   - general user
      4|aamt|3       - general user
      5|aristotle|3  - general user
      6|atayag|3     - general user
1. Show the interface for:
   a. general user (aamtayag)
      - briefly show 1) hazard reporting, 2) hazard grid
      - briefly show hazard map highlighting 1) road user at center, 2) all hazards reported & colour-coded, 3) circle, 4) type & description of each hazard
      - briefly show reports + export
   b. admin support (arnold)
      - briefly show 1) hazard moderation grid, 2) sorting, 3) hazard count, 4) mapping (no circle)
      - briefly show 1) analytics dashboard (high-level stats: volume & frequency analytics), 2) maintenance dashboard, 3) reports
   c. admin (aries)
2. Demo how to submit a hazard report
   a. with geolocation (login aamtayag in Chrome)
      Desc: Sited a huge pothole along Symonds Street and City Road-aamtayag
      Image: street-pothole.jpg
      Type: Pothole
      Severity: Critical
   b. with disabled geolocation (login aamt in Safari)
      - Notes:
         1. Disable geolocation from the address bar (Chrome)
            Chrome: Settings > Privacy and security > Site settings > Location
            Safari: Settings > Websites > Location - this setting is done prior to presentation
         2. Fetches ALL hazards (no radius applied)
      Desc: Foggy road along Wordsworth Road Manurewa-aamt
      Image: foggy_road.webp
      Type: Fog and Reduced Visibility
      Severity: High
      Place: 19B Beeston Crescent Manurewa, Auckland 2102
   c. SQL: select * from road_hazards where hazard_id > 89;
           select * from road_hazard_votes where hazard_id > 89;
           select * from road_hazard_flags where hazard_id > 89;
3. Upvote functionality
   a. aamtayag (Chrome)
      - upvote your own report - rejected
      - upvote the report created by aamt (safari) - accepted
   b. aamt (Safari)
      - upvote your own report - rejected
      - upvote the report created by aamtayag (Chrome) - accepted
   c. logout aamtayag, login aristotle (Chrome)
      logout aamt, login atayag (Safari)
   d. aristotle (Chrome)
      - upvote the report created by aamtayag & aamt
   e. atayag (Safari)
      - upvote the report created by aamtayag; status will change to "Authority Notified"; email notification will be sent to road authorities
      - upvote the report created by aamt; status will change to "Community Verified"
   f. check the email notification sent to yoobeestud@gmail.com
4. Flagging functionality
   a. aamtayag (Chrome)
      - flag your own report - rejected
      - flag report created by aamt - accepted; also, the flag button is now disabled (can only flag once per report per session)
      - flag report with the highest number of flags (i.e. Car crash incident along Inverness Road and Clyde Road)
5. Hazard moderation - arnold (Chrome)
   a. Approval
      - approve report created by aamtayag; notice status changes to "Scheduled"
        Reason: Pothole can cause accident! Must fix ASAP!
      - approve report created by aamtayag again; it disappear from hazard grid; status changes to "Resolved"; check in Reports
        Reason: Pothole is fixed
      - check Analytics dashboard, notice the stats change?
   b. Rejection
      - reject report created by aamt; it disappear from hazard grid; status changes to "Rejected"
        Reason: Fog hazard no longer exists!
      - check Reports dashboard


### Presentation Ideas
1. Ideas on presentation sequence:
   What is the project about & its objectives, i.e.:
      - a platform for road users to report road hazards & trigger prompt action from road authorities
      - a platform for road authorities to know, with good accuracy, where the road hazards to quickly resolve them
      - a platform to give road authorities meaningful data as a basis for present & future road infrastructure planning & development
      - a platform that aims to reduce road incidents & ultimately save lives
   Start with the research questions
   Road Hazard - definition
   Road Hazard when reported:
      - will have an initial status of Reported, i.e. hazard_status_id=1
         Road Hazard Status Lifecycle
      - will be assigned a type (a hazard_type_id)
         Road hazard classes and types
      - is also assigned a severity, i.e. road_hazard_severity
         Road hazard severity
   Definition of terms:
      (1) road users - motorists, cyclists, & pedestrians
      (2) road authorities - entities such as the Auckland Council, NZTA, and their intermediaries
      (1) vetted - formally evaluated, checked, or approved to ensure suitability or correctness
            peer-vetted
            authority-vetted
      (2) upvote - express approval or agreement with a hazard report
      (3) flagged - to mark for attention or treatment as non-existent
2. Presentation should be based on lifecycle


# Thoughts
1. Avg resolution time could be a barometer for efficiency


### Steps:
1. Verify Node.js (v22.11.0) and npm (11.3.0) is installed
   node -v
   npm -v, npm install -g npm@latest
2. Initialize & install dependencies
   npm init -y
   npm install
3. Verify npm packages
   npm list
   npm list -all
4. Start the Server
   npm start


### Changes/Refinements
1. Changed status Completed to Resolved
2. Changed status_type column to status_name in road_hazard_status


### SQL Queries
1. users
select user_id, username, user_type_id from users where user_type_id=3;
         3|aries|1      - admin
         2|arnold|2     - admin support
         1|aamtayag|3   - general user
         4|aamt|3       - general user
         5|aristotle|3  - general user
         6|atayag|3     - general user

2. road_hazards
select a.hazard_id,b.username,a.user_id,c.user_type_name,d.severity_name,a.user_severity_id,e.status_name,a.hazard_status_id,
a.hazard_desc,a.vote_count,a.flag_count,a.created_at,a.updated_at 
from road_hazards a,users b,user_type c, road_hazard_severity d, road_hazard_status e
where a.user_id=b.user_id and b.user_type_id=c.user_type_id and a.user_severity_id=d.severity_id and a.hazard_status_id=e.status_id;

select hazard_id,user_id,hazard_type_id,hazard_status_id,user_severity_id,hazard_desc,latitude,longitude,vote_count,flag_count 
from road_hazards order by user_id,hazard_id;

update road_hazards set vote_count=2,hazard_status_id=1 where hazard_id=2;
update road_hazards set hazard_status_id=4 where hazard_id=10;

3. road_hazard_votes
select hazard_id,user_id,created_at from road_hazard_votes order by hazard_id,user_id;
select hazard_id,user_id,created_at from road_hazard_votes where user_id=1 order by hazard_id,user_id;

4. road_hazard_status
select status_id,status_name from road_hazard_status ;


### TODO
5. Integrate mapping with user location defined in dashboard.html
4. Add the moderation user ID in Resolved/Rejected Reports
3. Add filtering (All, Rejected only, Resolved only) in Reports->Resolved/Rejected Reports and export only what is filtered
2. Reports - add a preview of the report
1. Make the top 10 hazardous coordinates 1) clickable (will highlight in hazard density map) with 2) copy functionality?

- Sidebar menu - prevent from scrolling up past the page header - DONE
- Added sorting by creation date in Hazard Moderation panel - DONE
- Added a hazard count in Hazard Moderation panel - DONE
- In hazard mapping, apply the highlight only for Hazard Reporting (not moderation) - DONE
- In hazard mapping, highlight the area around the road user (using RADIUS) - DONE
- Add reason when approving/rejecting a hazard report - DONE
- Generate a process flow diagram for road hazard management - DONE
- Add hazard description in email notification - DONE
- Moderation page - provide sort mechanism of hazards by #flags (default), #upvotes, severity, and hazard status - DONE
- Display username at right-hand side of page header with drop-down menu to Sign-out - DONE
- Test with hard-coded latitude/longitude, with geolocation, no geolocation support - DONE
- Don’t commit .env to version control (add it to .gitignore) - DONE
- In maps.html, implement radius??? - NOTDONE
- Add maintenance page for road_hazard_class & road_hazard_type in Admin (now dashboard) page - DONE
- Change the text localhost:3000 says to "SafeRoads Navigator says:" - NOTDONE (too much effort.)
- ≤ 500 m - make this dynamic - DONE
- Put also a marker on the location of road user - DONE
- When updating the hazard_status_id, update also the updated_at column - DONE
- Encrypt all PII, e.g. email, phone, etc. - DONE
- Make radius configurable, store in process.env - DONE
- Create a Road hazard lifecycle - DONE
- Make ERD diagram of database schema - DONE


### Test Cases: NOTE take screenshots
1. User Login
   - wrong username - Pass
   - wrong password - Pass
2. User Registration
   - missing username - Pass
   - missing email - Pass
   - missing password - Pass
   - missing phone - Pass
   - duplicate username - Pass
   - email and phone is encrypted - Pass
3. Road Hazard Reporting
   - road hazard reporting without description - Pass
   - road hazard reporting without image - Pass
   - road hazard reporting without hazard type - Pass
   - road hazard reporting without severity - Pass
   - road hazard reported is visible in grid and map - Pass
   - test manual entry of place name (geocoding feature) - Pass
         - Steps: 1) Click on the address and disable location services, 2) refresh the page
         - Use these addesses: 1) 794 East Coast Road, Oteha, Auckland 0630 (CIC), 2) 100 Hospital Road, Middlemore Hospital, Auckland 2025 (Middlemore Hospital)
         - Note: 1) must refresh the page everytime a new hazard is reported, 2) no geolocation messes up the loading of nearby hazards
4. Road Hazard Upvoting
   - road user cannot upvote his own report - Pass
      user aamtayag, hazard_id=11 (Broken traffic light at Weymouth Road)
   - road user can only upvote once per report - Pass
      user aamtayag, hazard id=17 (Foggy road along Weymouth Road and Rowandale Avenue)
   - change RADIUS env variable and hazards report are adjusted - Pass
   - road user exceed upvote limit per day (DAILY_UPVOTE_LIMIT) - Pass
      1) use aamtayag user
      2) use hazard_id = 34 (Motorists altercation in Alfriston Road),
                         36 (Road closure in Popes Road corner Mill Road),
                         37 (Construction/road works along Mill Road Takanini)
                         35 (Road accident (car crash) in Mill Road Takanini)
      3) SQL: update road_hazards set vote_count=0 where hazard_id in (34,35,36,37);
              delete from road_hazard_votes where hazard_id in (34,35,36,37);
   - a hazard report with status=1 (Received/UnderReview), severity=5 (Critical), upvoted 3x (UPVOTE_THRESHOLD), status will change to 3 (Authority Notified) and will trigger email notification - Pass
         - use aamtayag first, then atayag user
         - use hazard_id = 17 (Foggy road along Weymouth Road and Rowandale Avenue)
         - SQL: select sum(vote_count) from road_hazards where hazard_status_id not in (5,6);
                update road_hazards set hazard_status_id=1, vote_count=2, updated_at='' where hazard_id=17;
                delete from road_hazard_votes where vote_id in (154);
   - hazard report with status=1 (Received/UnderReview), severity!=5 (not Critical), upvoted 3x (UPVOTE_THRESHOLD), status will change to 2 (Community Verified) - Pass
         - use aamtayag first, then atayag user
         - use hazard_id = 11 (Broken traffic light at Weymouth Road)
         - SQL: select sum(vote_count) from road_hazards where hazard_status_id not in (5,6);
                update road_hazards set hazard_status_id=1, vote_count=2, updated_at='' where hazard_id=11;
                delete from road_hazard_votes where vote_id in (149);
5. Road Hazard Flagging
   - road user cannot flag his own report - Pass
      user: aamtayag, hazard_id=28 (Car crash incident along Inverness Road and Clyde Road)
   - road user can only flag once per session - Pass
      user: atayag, hazard_id=28 (Car crash incident along Inverness Road and Clyde Road)
6. Hazard Moderation
   - all sort features are working - Pass
7. Approve road hazard (sort by hazard status)
   - hazard status transition from 1/2/3 to 4 (Scheduled)
      From 1->4 (Recieved/UnderReview -> Scheduled) - Pass
         - use hazard_id=42 (Rockfall obstructing the road)
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=42;
      From 2->4 (Community Verified -> Scheduled) - Pass
         - use hazard_id=3 (Flooding along McKean Avenue, Manurewa)
         - SQL: update road_hazards set hazard_status_id=2 where hazard_id=3;
      From 3->4 (Authority Notified -> Scheduled) - Pass
         - use hazard_id=2 (Fallen electric post along Wordsworth Rd)
         - SQL: update road_hazards set hazard_status_id=3 where hazard_id=2;
   - hazard status transition from 4 (Scheduled) to 5 (Resolved) - Pass
         - will be removed from grid
         - use hazard_id=42 (Rockfall obstructing the road)
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=42;
   - road hazard is approved and record is inserted in road_hazard_moderation with comments - Pass
         - use hazard_id=14 (Road closure with diversion)
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=14;
   - road hazard is approved and record is inserted in road_hazard_moderation w/out comments - Pass
         - use hazard_id=14 (Road closure with diversion)
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=14;
8. Reject road hazard (sort by hazard status)
   - hazard status transition from 1/2/3/4 to 6 (Rejected)
      From 1->6 (Recieved/UnderReview -> Rejected) - Pass
         - will be removed from grid
         - use hazard_id=14 (Road closure with diversion), will be removed from grid
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=14;
      From 2->6 (Community Verified -> Rejected) - Pass
         - will be removed from grid
         - use hazard_id=3 (Flooding along McKean Avenue, Manurewa)
         - SQL: update road_hazards set hazard_status_id=2 where hazard_id=3;
      From 3->6 (Authority Notified -> Rejected) - Pass
         - will be removed from grid
         - use hazard_id=2 (Fallen electric post along Wordsworth Rd)
         - SQL: update road_hazards set hazard_status_id=3 where hazard_id=2;
      From 4->6 (Scheduled -> Rejected) - Pass
         - will be removed from grid
         - use hazard_id=42 (Rockfall obstructing the road)
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=42;
   - road hazard is rejected and record is inserted in road_hazard_moderation with comments - Pass
         - use hazard_id=14 (Road closure with diversion)
         - SQL: update road_hazards set hazard_status_id=1, updated_at='' where hazard_id=14;
9. Analytics
   - average resolution computation is good - Pass
         - use hazard_id = 1/4 (Small pothole along City Road and Queen Street/Poor road condition along Liverpool St.)]
         - SQL: select hazard_status_id, created_at, updated_at from road_hazards where hazard_id in (1,4);
                update road_hazards set hazard_status_id=5, updated_at = CURRENT_TIMESTAMP where hazard_id in (1,4);
                update road_hazards set hazard_status_id=1, updated_at = '' where hazard_id in (1,4);
10. Maintenance
   - user maintenance tab load correctly and display the add user, edit, delete buttons - Pass
         - add user button is working properly
         - edit user button is working properly
         - delete user button is working properly
   - report hazard class maintenance tab load correctly and display the add user, edit, delete buttons - Pass
         - add class button is working properly
         - edit class button is working properly
         - delete class button is working properly
   - report hazard type maintenance tab load correctly and display the add user, edit, delete buttons - Pass
         - add type button is working properly
         - edit type button is working properly
         - delete type button is working properly
11. Reports
   - weekly report hazard load correctly and can export - Pass
   - monthly report hazard load correctly and can export - Pass
   - unresolved/open hazards load correctly and can export - Pass
   - resolution rate by type load correctly and can export - Pass
   - resolved/rejected reports load correctly and can export - Pass


### System Features/Restrictions:
1. Road hazards reporting
   - road users can only see road hazard reports within a specified radius, i.e. .env.RADIUS, which is also reflected in the page
   - road users cannot upvote/flag thier own report
   - road users can only upvote once per report
   - road users can only flag once per session
   - hazard report is displayed with number of upvotes & flags
   - road users have limited number of upvotes per day, specified by .env.DAILY_UPVOTE_LIMIT
   - distance of hazard from road user is indicated
   - date of hazard report is indicated
2. Road hazards mapping
   - road hazards have markers and labels
   - the markers highlight the severity level of the hazard, i.e. Negligible-Green,Minor-Blue,Moderate-Yellow,High-Orange,Critical-Red
   - location of road user is also highlighted in map
   - all hazard reports will be visible, with emphasis on the closest to the road user
3. Road hazard lifecycle
   - a road hazard report, status 1 (Received/UnderReview), upvoted 3x (UPVOTE_THRESHOLD) will change to 2 (Community Verified)
   - if road hazard status is Critical and upvoted 3x (UPVOTE_THRESHOLD), will change to 3 (Authority Notified), email notification will be sent to ALERT_EMAIL
   - hazard reports flagged can change to 6 (Rejected)


### Notes:
0. Patent this study
1. Google Maps API Key: AIzaSyDUqJv_YMAL1t-tW5MfZ-9f1aki4iXC2C0, exki htwt estx ymov
2. lsof -i :3000, kill -9 PID
3. open -e .env - open the configuration file
4. yoobeestud@gmail.com / g6479014K
5. twilio sendgrid recovery code: 2T7N51BD1W3VQMK2RKPFR3Z8, yoobeestud@gmail.com, g6479014K
6. ClientID: 816018636894-ms4qn9l426o9q2mpt3dvsl7h26qqrqdc.apps.googleusercontent.com
   ClientSecret: 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


### Assess2 thoughts
1. Concept of reusability components
2. Changing the server URL from http://localhost:3000 to something like https://saferoads.com
   - Deploy the Node.js/Express server to a cloud provider or hosting service, i.e. AWS EC2
   - Register the domain, i.e. www.saferoads.com, with a domain registrar like AWS Route 53
   - Updating the frontend code to use the new domain


### Future Work:
1. Embed Machine Learning capabilities
   - Automatic classication of road hazard type (and severity) based on uploaded image
   - Hotspot Forecasting - Predict likely future hazard hotspots using time series analysis and spatial clustering
   - Resolution Time Prediction - Predict how long a hazard will take to resolve based on its type, location, and past trends
2. On Analytics:
   - Capture timestamps of status changes to show how quickly the authorities respond to these reported hazards
   - Anomaly/Outlier Detection: Sudden spikes in hazard reporting by type/location
   - Make the coordinates in the Top 10 Hazardous Areas clickable and would highlight in the Hazard Density Map
3. Automate the rejection of reports, i.e. set a flag threshold
4. Provide guidelines on severity ranking
5. Promote incentivization schemes to encourage citizen involvement


### Tools and Tewchnologies used

# Frontend
1. HTML5 / CSS3 / Javascript - frontend foundations
2. Bootstrap5 - frontend toolkit for building fast & responsive sites (https://getbootstrap.com/docs/5.3/getting-started/introduction/)
3. Chart.js - javascript charting library (https://www.chartjs.org/docs/latest/samples/information.html)
4. Leaflet.js - javascript library for mobile-friendly interactive maps (https://leafletjs.com/examples.html)
5. Google Maps API - for mapping reported road hazards
6. OpenStreetMap Nominatim v5.1.0 (free-an open-source geocoding service), Google Maps Geocoding API (requires billing/account)
7. Socket.IO - enable sreal-time communication with backend

# Backend
1. npm 11.3.0 - package manager for the JavaScript programming language
2. Node.js - open-source, cross-platform JavaScript runtime environment
3. Express@4.21.2 - web application framework for Node.js for building web and mobile applications, particularly for creating RESTful APIs.
   express-session@1.18.1, socket.io@4.8.1
4. Others
   - Body–parser – used to parse incoming HTTP requests
   - Express–session – used for session management as well as user authentication 
   - Bcrypt@5.1.1 - for hashing passwords
   - Multer@1.4.5-lts.2 - middleware package for handling file uploads (https://www.npmjs.com/package/multer)
   - dotenv@16.5.0 - for configuration variables
   - Crypto - for encrypting PII (email and phone)
   - Gmail SMTP with Nodemailer@6.10.1 - for sending email notifications

# Database
1. SQLite3@5.1.7

# URLs
1. https://www.latlong.net
