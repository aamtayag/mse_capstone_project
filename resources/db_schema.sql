# #####################################################
# ## Database Schema Design
# #####################################################

-- 1. user_type: (look up table)
CREATE TABLE IF NOT EXISTS user_type (
   user_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
   user_type_name TEXT NOT NULL UNIQUE,
   user_type_desc TEXT,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME
);

-- user types (3 rows)
insert into user_type(user_type_name,user_type_desc) values("Administrator","System Administrator");
insert into user_type(user_type_name,user_type_desc) values("Admin Support","System Maintenance");
insert into user_type(user_type_name,user_type_desc) values("General User","System User");



-- 2. road_hazard_class: (look up table)
CREATE TABLE IF NOT EXISTS road_hazard_class (
    class_id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_name TEXT NOT NULL UNIQUE,
    class_desc TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- road hazard classes (6 rows)
insert into road_hazard_class(class_name) values("Road Surface Defects");
insert into road_hazard_class(class_name) values("Environmental and Weather-Related Hazards");
insert into road_hazard_class(class_name) values("Physical Obstructions and Debris");
insert into road_hazard_class(class_name) values("Infrastructure and Signage Issues");
insert into road_hazard_class(class_name) values("Human and Vehicle-Related Hazards");
insert into road_hazard_class(class_name) values("Temporary or Event-Driven Hazards");



-- 3. road_hazard_type: (look up table)
CREATE TABLE IF NOT EXISTS road_hazard_type (
   hazard_id INTEGER PRIMARY KEY AUTOINCREMENT,
   hazard_name TEXT NOT NULL UNIQUE,
   hazard_desc TEXT,
   class_id INTEGER NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   FOREIGN KEY (class_id) REFERENCES road_hazard_class(class_id)
);

-- road hazard types (31 rows)
-- (1) Road Surface Defects (6 rows)
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Potholes","Large, deep potholes in high-traffic areas pose a very high risk of accidents and vehicle damage",1);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Cracks and Fissures","Smaller cracks may only slightly affect traction but can develop into larger issues if not maintained",1);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Uneven Pavement/Expansion Joints","Can be hazardous at higher speeds or in poor weather conditions",1);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Loose Gravel or Debris","Depends on the amount and type of debris; loose gravel on highways can cause serious accidents",1);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Spills (Oil, Chemicals, Fuel)","Landslide risk for vehicles if the spill is widespread or occurs on a curve",1);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Faded Road Markings)","Poorly visible lane or warning markings that affect driver guidance",1);

-- (2) Environmental and Weather-Related Hazards (6 rows)
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Icy or Frosty Roads","Icy surfaces significantly reduce traction and increase stopping distances",2);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Snow and Snow Drifts","Depends on the amount and compaction; heavy snow can lead to accidents and road closures",2);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Heavy Rain and Flooding","Increases the risk of hydroplaning and may completely obscure road markings",2);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Fog and Reduced Visibility","Often rated moderately, but can be more critical on major roadways with high speeds",2);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("High Winds and Hail","These conditions can dislodge debris or even affect high-profile vehicles significantly",2);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Blowing Dust or Sand","Reduced visibility and potential abrasive effects on the road",2);

-- (3) Physical Obstructions and Debris (5 rows)
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Fallen Trees or Branches","Can cause major blockages or be hazardous if they fall on vehicles",3);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Rock Falls or Loose Rocks","Depends on the size and speed at which debris is moving; more severe in mountainous or steep areas",3);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Construction Debris","Generally moderate if cleared quickly, but prolonged presence can be hazardous",3);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Broken Glass/Car Parts","Usually cause traction issues but are less likely to result in severe injuries unless combined with other factors",3);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Unattended or Disabled Vehicles","Vehicles that have stopped unexpectedly on the road",3);

-- (4) Infrastructure and Signage Issues (5 rows)
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Malfunctioning Traffic Signals","Can lead to confusion at intersections, significantly increasing collision risk",4);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Missing or Faded Road Signage","Reduces driver guidance and may lead to abrupt maneuvers",4);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Damaged Guardrails/Barriers","Increases the risk of vehicles veering off the road in emergency conditions",4);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Obstructed Lane Markings","Primarily a risk in poor visibility conditions",4);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Poorly Maintained Roadways","Crumbling or deteriorating infrastructure, including bridges and overpasses",4);

-- (5) Human and Vehicle-Related Hazards (4 rows)
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Aggressive/Erratic Driving","Not a physical hazard but can significantly compound other hazards",5);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Distracted or Impaired Driving","Increases the likelihood of collisions with other hazards",5);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Inadequate Vehicle Maintenance (e.g., brake failure)","Elevates the risk of accidents under hazardous conditions",5);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Road Rage Incidents","Confrontations that can lead to dangerous driving conditions",5);

-- (6) Temporary or Event-Driven Hazards (5 rows)
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Construction Zones and Temporary Detours","Hazards are usually temporary, but the sudden changes can cause confusion and accidents",6);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Accident Scenes","Pose unpredictable hazards for drivers trying to navigate around them",6);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Animal Crossings/Wildlife","Varies widely depending on the species and the suddenness of the encounter",6);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Event-Driven Hazards (parades, sports events)","Congestion and temporary obstructions primarily; severity depends on the scale of the event",6);
insert into road_hazard_type(hazard_name,hazard_desc,class_id) values("Temporary Road Closures or Detours","Situations that require rapid adjustment by drivers",6);



-- 4. road_hazard_severity: (look up table)
CREATE TABLE IF NOT EXISTS road_hazard_severity (
   severity_id INTEGER PRIMARY KEY AUTOINCREMENT,
   severity_name TEXT NOT NULL UNIQUE,
   severity_desc TEXT,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME
);

-- 1: Negligible - Green	#00FF00 - 🟢 Negligible - https://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png
-- 2: Minor - Chartreuse	#99FF00 - 🔵 Minor - https://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png
-- 3: Moderate - Yellow	#FFFF00 - 🟡 Moderate - https://maps.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png
-- 4: High - Orange	#FF9900 - 🟠 High - https://maps.google.com/intl/en_us/mapfiles/ms/micons/orange-dot.png
-- 5: Critical - Red	#FF0000 - 🔴 Critical - https://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png

-- severity ratings (5 rows)
insert into road_hazard_severity(severity_name) values("Negligible");
insert into road_hazard_severity(severity_name) values("Minor");
insert into road_hazard_severity(severity_name) values("Moderate");
insert into road_hazard_severity(severity_name) values("High");
insert into road_hazard_severity(severity_name) values("Critical");



-- 5. road_hazard_status: (look up table)
CREATE TABLE IF NOT EXISTS road_hazard_status (
   status_id INTEGER PRIMARY KEY AUTOINCREMENT,
   status_name TEXT NOT NULL,
   status_desc TEXT NOT NULL,
   status_msg TEXT NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME
);

-- hazard status (6 rows)
insert into road_hazard_status(status_name,status_desc,status_msg) values("Received/UnderReview","Road hazard report has been successfully submitted and will be reviewed soon.","Road hazard report is under review");
insert into road_hazard_status(status_name,status_desc,status_msg) values("Community Verified","Road hazard report has been peer-vetted thru community upvotes","Road hazard report has now recieved sufficient number of upvotes");
insert into road_hazard_status(status_name,status_desc,status_msg) values("Authority Notified","Road hazard report is critical and sufficiently community-vetted and it was assigned to the maintenance authority responsible.","Road hazard report has been assigned to: (name of the maintenance authority)");
insert into road_hazard_status(status_name,status_desc,status_msg) values("Scheduled","Road hazard report has been reviewed by the maintenance authority and a maintenance work has been scheduled.","Road hazard report has been accepted and will be handled soon.");
insert into road_hazard_status(status_name,status_desc,status_msg) values("Resolved","Action has been taken. This action may be maintenance works or temporary works to ensure the infrastructure is safe. It could also mean that the authority has visited the location of the reported issue and it was identified that the infrastructure is safe, and no further actions are needed.","1) Road hazard report has been resolved. Either actions have been taken to improve the infrastructure’s safety or after an on-site inspection, no immediate action is required");
insert into road_hazard_status(status_name,status_desc,status_msg) values("Rejected","Road hazard report has been rejected.","Road hazard report is rejected because: 1) the report is noncompliant with the terms & conditions of the app, 2) picture is not clear enough, 3) location has low accuracy, i.e. more than 100 meters away, 4) The report has already been recorded and is being handled by a maintenance authority");


-- 6. users: (main table)
CREATE TABLE IF NOT EXISTS users (
   user_id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT NOT NULL UNIQUE,
   email TEXT NOT NULL,
   password_hash TEXT NOT NULL,
   phone TEXT,
   user_type_id INTEGER DEFAULT 3 CHECK(user_type_id IN (1,2,3)),
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME
);

-- users (6 rows)
insert into users(username,email,password_hash,phone,user_type_id) values("aamtayag","aamtayag@gmail.com","Password123","02902389261",3);
insert into users(username,email,password_hash,phone,user_type_id) values("arnold","aamtayag@gmail.com","Password123","02902389261",2);
insert into users(username,email,password_hash,phone,user_type_id) values("aries","aamtayag@gmail.com","Password123","02902389261",1);
insert into users(username,email,password_hash,phone,user_type_id) values("aamt","aamtayag@gmail.com","Password123","02902389261",3);
insert into users(username,email,password_hash,phone,user_type_id) values("aristotle","aamtayag@gmail.com","Password123","02902389261",3);
insert into users(username,email,password_hash,phone,user_type_id) values("atayag","aamtayag@gmail.com","Password123","02902389261",3);


-- 7. road_hazards: (primary table)
CREATE TABLE IF NOT EXISTS road_hazards (
   hazard_id INTEGER PRIMARY KEY AUTOINCREMENT,
   hazard_desc TEXT NOT NULL,
   hazard_image TEXT NOT NULL,
   latitude REAL NOT NULL,
   longitude REAL NOT NULL,
   vote_count INTEGER DEFAULT 0,
   flag_count INTEGER DEFAULT 0,
   hazard_type_id INTEGER NOT NULL,
   hazard_status_id INTEGER NOT NULL,
   user_id INTEGER NOT NULL,
   user_severity_id INTEGER NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   FOREIGN KEY (hazard_type_id) REFERENCES road_hazard_type(hazard_id),
   FOREIGN KEY (hazard_status_id) REFERENCES road_hazard_status(status_id),
   FOREIGN KEY (user_id) REFERENCES users(user_id),
   FOREIGN KEY (user_severity_id) REFERENCES road_hazard_severity(severity_id)
);



-- 8. road_hazard_comments: (main table)
CREATE TABLE IF NOT EXISTS road_hazard_comments (
   comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
   hazard_id INTEGER NOT NULL,
   user_comments TEXT NOT NULL,
   auth_comments TEXT NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   FOREIGN KEY (hazard_id) REFERENCES road_hazards(hazard_id)
);


-- 9. road_hazard_votes: (main table)
CREATE TABLE IF NOT EXISTS road_hazard_votes (
   vote_id      INTEGER PRIMARY KEY AUTOINCREMENT,
   hazard_id    INTEGER NOT NULL,
   user_id      INTEGER NOT NULL,
   created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at   DATETIME,
   UNIQUE(hazard_id, user_id),
   FOREIGN KEY(hazard_id) REFERENCES road_hazards(hazard_id),
   FOREIGN KEY(user_id)   REFERENCES users(user_id)
);


-- 10. road_hazard_flags: (main table)
CREATE TABLE IF NOT EXISTS road_hazard_flags (
   flag_id      INTEGER PRIMARY KEY AUTOINCREMENT,
   hazard_id    INTEGER NOT NULL,
   user_id      INTEGER NOT NULL,
   reason       TEXT,
   created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at   DATETIME,
   FOREIGN KEY(hazard_id)      REFERENCES road_hazards(hazard_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id)
);
