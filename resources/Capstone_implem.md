
# #####################################################
# ## Capstone Project Description
# #####################################################

Proposed Project Tile: SafeRoads Navigator: A System for Real-Time Road Hazards Monitoring Using Crowdsourced Data and Dual Vetting Approach
This study more an action research (participatory approach combining action (change interventions) and research)

Proposed Project Description:
   1. A system that guides users and authorities toward safer roads by highlighting and tracking hazardous areas.
   2. Provide a view of road hazards by mapping and visualizing incidents around the clock.
   3. Real-time alerts and connectivity between road users and maintenance teams, ensuring that hazards are quickly reported and addressed.

Project Use Cases:
   1. Emergency road reporting – a user notices a large pothole that could cause an accident and submits a report through the mobile web interface. 
      The system captures the location automatically or allows the user to enter it manually. The report is then plotted on a real-time map for awareness.
   2. Traffic and road safety analysis – city planners use the dashboard to view heat maps of hazard reports. They identify the top 10 areas with frequent 
      reports and schedule repairs or road safety audits in those locations.
   3. Crowdsourced validation – after a report is submitted, other users can view the hazard on the map, add comments, or vote on whether the hazard is 
      genuine improving data reliability.
   4. Automated alerts for road maintenance crews – depending on the severity type or when the system detects a cluster of hazards in a specific area, it 
      automatically sends notifications to the local road maintenance team for rapid response.
   5. Historical trends for policy making – the system aggregates data over time, providing downloadable reports and visualizations that help local 
      authorities understand long-term road hazard trends and plan infrastructure improvements accordingly.

Key Features:
   1. Hazard Reporting Interface
      - Automatic location capture - automatically capture the user’s current latitude and longitude when a hazard is reported.
      - Manual location entry - an option for users to manually input their location if location services are disabled or not available.
      - Detailed report form – allows users to describe the hazard (e.g., potholes, debris, accidents), attach photos or videos, and select the type of hazard from predefined categories
   2. User Authentication and Account Management
      - User registration/login - enable users to create an account, which could include social logins, to track their reporting history and receive notifications
      - Role-based access control - different roles for road users, moderators, and administrators—for instance, allowing moderators to verify or flag reports
   3. Dashboard and Data Visualization
      - Real-time map view - use Google Maps to visually display hazard reports as markers based on the saved coordinates
      - Analytics and top hazard areas - automatically aggregate and display the top 10 areas (or clusters) with the highest number of reports using heat maps or cluster markers
      - Reporting trends and filters – interactive charts and timelines that show the trends over time, frequency by hazard type, and filters by date or area
   4. Notification and Alert System
      - Push notifications/email alerts - send alerts to users when a new report is submitted nearby or when an incident report has been updated/resolved
      - Feedback to road authorities - automatically notify local authorities or maintenance crews about frequently reported hazards for prompt attention
   5. Incident Verification and Moderation
      - Report Moderation - allow administrators to verify incoming reports, mark them as confirmed or false positives, or remove duplicates
      - Crowdsourced Validation - let other users vote or comment on the accuracy of the reports to improve overall data quality
   6. Historical Data and Reporting
      - Report archive – maintain a log of all hazard reports that can be used for historical analysis
      - Downloadable reports – provide options to export data in formats such as CSV or PDF for further analysis by city planners or researchers
   7. Integration with External Systems
      - Emergency services integration – create integration points with local emergency services, allowing automatic dispatch or priority tagging if a hazard results in an accident
   8. Geospatial Data Enhancements
      - Spatial clustering - implement algorithms to cluster nearby hazards and provide a “density map” or heatmap view that highlights high-risk areas
   9. Mobile-Friendly Interface
      - Responsive web design – ensure that the web interface is mobile-friendly, as many road users will likely report hazards directly from their smartphones 


# ########################################################
# ## Implementation Ideas - see Capstone-Presentation.md
# ########################################################

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
1. HTML / CSS / Javascript - frontend foundations
2. Bootstrap - frontend toolkit for building fast & responsive sites (https://getbootstrap.com/docs/5.3/getting-started/introduction/)

# Backend
1. npm 11.3.0, Node.js, Express@4.21.2 - backend
   express-session@1.18.1, socket.io@4.8.1
2. Multer@1.4.5-lts.2 - middleware package for handling file uploads (https://www.npmjs.com/package/multer)
3. Bcrypt@5.1.1 - for hashing passwords
4. Crypto - for encrypting PII (email and phone)
5. dotenv@16.5.0 - for configuration variables


# Mail, Charts, and Mapping
1. Chart.js - javascript charting library (https://www.chartjs.org/docs/latest/samples/information.html)
2. Leaflet.js - javascript library for mobile-friendly interactive maps (https://leafletjs.com/examples.html)
3. Gmail SMTP with Nodemailer@6.10.1 - for sending email notifications
4. OpenStreetMap Nominatim v5.1.0 (free-an open-source geocoding service), Google Maps Geocoding API (requires billing/account)
5. Google Maps API - for mapping reported road hazards
   - Enable/disable geolocation:
      - Chrome: Settings > Privacy and security > Site settings > Location
      - Safari: Settings > Websites > Location

# Database
1. SQLite3@5.1.7


### Analytics
1. Hazard Volume & Frequency Analytics
   - Total Hazards Reported - DONE
      SQL: SELECT COUNT(*) AS total_hazards FROM road_hazards;
   - Hazard Reporting Trend Over Time - ok
      SQL: SELECT DATE(created_at) AS report_date, COUNT(*) AS hazard_count
            FROM road_hazards
            GROUP BY report_date
            ORDER BY report_date;
      Visualization: Line chart or bar chart

2. Hazard Classification Analytics
   - Hazard Counts by Type - ok
      SQL: SELECT t.hazard_name, COUNT(*) AS count
            FROM road_hazards h
            JOIN road_hazard_type t ON h.hazard_type_id = t.hazard_id
            GROUP BY h.hazard_type_id
            ORDER BY count DESC;
      Visualization: Bar chart, pie chart
   - Hazards by Severity - ok
      SQL: SELECT s.severity_name, COUNT(*) AS count
            FROM road_hazards h
            JOIN road_hazard_severity s ON h.user_severity_id = s.severity_id
            GROUP BY h.user_severity_id
            ORDER BY count DESC;
      Visualization: Pie chart, bar chart

3. Location-Based Analytics
   - Hazard Heatmap / Density Map
      Use all latitude and longitude values
      Visualization: Google Maps/Leaflet heatmap overlay
   - Top Hazardous Locations - ok
      SQL: SELECT ROUND(latitude, 2) AS lat_cluster, ROUND(longitude, 2) AS lng_cluster, COUNT(*) AS count
            FROM road_hazards
            GROUP BY lat_cluster, lng_cluster
            ORDER BY count DESC
            LIMIT 10;

4. Status & Workflow Analytics
   - Hazard Status Breakdown - ok
      SQL: SELECT s.status_name, COUNT(*) AS count
            FROM road_hazards h
            JOIN road_hazard_status s ON h.hazard_status_id = s.status_id
            GROUP BY h.hazard_status_id
            ORDER BY count DESC;
   - Average Resolution Time - ok
      SQL: SELECT AVG(julianday(updated_at) - julianday(created_at)) AS avg_resolution_days
            FROM road_hazards
            WHERE hazard_status_id = (SELECT status_id FROM road_hazard_status WHERE status_name='Resolved');

5. User Engagement Analytics
   - Most upvoted/flagged hazards - ok
      SQL: SELECT hazard_id, hazard_desc, vote_count
            FROM road_hazards
            ORDER BY vote_count DESC
            LIMIT 10;
   - Most flagged hazards - ok
      SQL: SELECT hazard_id, hazard_desc, flag_count
            FROM road_hazards
            ORDER BY flag_count DESC
            LIMIT 10;
   - Top Reporting Users (Users who report the most hazards) - ok
      SQL: SELECT u.username, COUNT(*) AS report_count
            FROM road_hazards h
            JOIN users u ON h.user_id = u.user_id
            GROUP BY h.user_id
            ORDER BY report_count DESC
            LIMIT 10;

6. Sample Analytics Dashboard Structure
   A. Overview Section
      Total hazards reported - DONE
      Hazards reported in last 7/30 days - both DONE
      Average daily reports - DONE
      Average resolution time - DONE
   B. Classification
      Hazards by type (bar chart) - DONE
      Hazards by severity - DONE
      Hazards by status - DONE
   C. Location
      Hazard density map - DONE
      Top 10 hazardous areas - DONE
   D. User Engagement
      Most upvoted hazards - DONE
      Most flagged hazards - DONE
      Top reporters - DONE
   F. Trends & Insights
      Reporting trends over time (line chart)
      Spikes/anomalies


# #####################################################
# ## System Documentation
# #####################################################

Lay out a full-stack React + Node.js + SQLite app in a single code canvas:

- Backend (`/backend`):  
  - `package.json`, `db.js` (schema + sample data), `server.js` (Express endpoints for register, login, and fetching nearby reports with a Haversine filter).  
- Frontend (`/frontend`):  
  - `package.json`, static `public/index.html`, React entrypoints (`index.js`, `App.js`), service layer (`services/api.js`), components for Login, Register, ReportsTable, and MapView (using `@react-google-maps/api`), and responsive CSS (`App.css`).

Follow these steps to run the app:

1. Backend  
   cd backend
   npm install
   node server.js
    - This creates `database.db`, seeds sample reports, and serves your API on port 3000.

2. Frontend  
   cd frontend
   npm install
   npm start
   - Ensure to replace both JWT secret and `API_KEY` for Google Maps in `MapView.js` before running.

3. Usage  
   - Register a new user, then log in.  
   - Click “Load Nearby Reports” to get records within 500 m of your browser’s geolocation.  
   - View them in a table (with images) or on a map via the “Show Map” button.

4. Directory structure:

/*
Directory structure:

backend/
  package.json
  db.js
  server.js

frontend/
  package.json
  public/index.html
  src/
    index.js
    App.js
    services/api.js
    components/
      Login.js
      Register.js
      ReportsTable.js
      MapView.js
    App.css
*/


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
insert into road_hazard_class(class_name,class_desc) values("Road Surface Defects","Flaws or damage on the road surface, such as potholes, cracks, uneven pavement, or loose gravel, that can pose risks to vehicles and pedestrians.");
insert into road_hazard_class(class_name,class_desc) values("Environmental and Weather-Related Hazards","Hazards caused by natural conditions, including heavy rain, flooding, fog, ice, snow, or fallen trees, which can affect road visibility and safety.");
insert into road_hazard_class(class_name,class_desc) values("Physical Obstructions and Debris","Objects blocking or cluttering the roadway, like fallen branches, rocks, construction materials, or spilled cargo, potentially causing accidents or requiring sudden maneuvers.");
insert into road_hazard_class(class_name,class_desc) values("Infrastructure and Signage Issues","Problems with road infrastructure or traffic signs, such as damaged guardrails, broken traffic lights, missing or unclear signage, and malfunctioning barriers, which may confuse drivers or compromise safety.");
insert into road_hazard_class(class_name,class_desc) values("Human and Vehicle-Related Hazards","Hazards arising from the actions of road users or vehicles, including stalled vehicles, reckless driving, jaywalking pedestrians, or cyclists in unsafe locations.");
insert into road_hazard_class(class_name,class_desc) values("Temporary or Event-Driven Hazards","Short-term hazards resulting from special events, roadworks, parades, accidents, or emergency situations that temporarily disrupt normal road conditions and require drivers to adapt quickly.");


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


-- NOTE: i wanna change this to below for naming consistency:
CREATE TABLE IF NOT EXISTS road_hazard_type (
   type_id INTEGER PRIMARY KEY AUTOINCREMENT,
   type_name TEXT NOT NULL UNIQUE,
   type_desc TEXT,
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

-- 1: Negligible  - 🟢 Negligible - https://maps.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png
-- 2: Minor       - 🔵 Minor - https://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png
-- 3: Moderate    - 🟡 Moderate - https://maps.google.com/intl/en_us/mapfiles/ms/micons/yellow-dot.png
-- 4: High        - 🟠 High - https://maps.google.com/intl/en_us/mapfiles/ms/micons/orange-dot.png
-- 5: Critical    - 🔴 Critical - https://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png

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


-- NOTE: i wanna add fullname column (to be displayed in page header)
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



-- 8. road_hazard_moderation: (main table)
CREATE TABLE IF NOT EXISTS road_hazard_moderation (
   moderation_id INTEGER PRIMARY KEY AUTOINCREMENT,
   hazard_id INTEGER NOT NULL,
   auth_id INTEGER NOT NULL,
   auth_action TEXT NOT NULL,
   auth_comments TEXT NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   FOREIGN KEY (hazard_id) REFERENCES road_hazards(hazard_id),
   FOREIGN KEY (auth_id) REFERENCES users(user_id)
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



# ##################









