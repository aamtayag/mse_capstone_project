# Master of Software Engineering (MSE) Capstone Project

# Title of Study:
SafeRoads Navigator: A System for Real-Time Road Hazards Management Using
Crowdsourced Data and Dual Vetting Approach

# Study Overview
SafeRoads Navigator proposes a real-time, web-based system for monitoring road hazards through crowdsourced data and a 
dual-vetting mechanism that ensures the accuracy and trustworthiness of user reports. The system allows drivers, cyclists, 
and pedestrians to report road hazards (e.g., potholes, floods, debris) and leverages both peer validation (upvotes/flags) 
and authority moderation to confirm their legitimacy.

# Purpose and Objectives
The study addresses the slow and fragmented nature of traditional road hazard reporting. Its objectives include:
1. Designing a trustworthy crowdsourced road hazard system that minimizes false reports.
2. Developing an end-to-end hazard management platform combining reporting, moderation, analytics, and alerts.
3. Embedding interactive dashboards and open-data interfaces to support data-driven decision-making by planners and safety authorities

# System Design
1. Architecture: Node.js/Express backend, SQLite database, JavaScript-based frontend, and Google Maps API integration.
2. Key Features:
   - Real-time hazard reporting and map visualization.
   - Dual verification (peer + authority).
   - Analytics dashboards and CSV data exports.
   - Role-based access, encryption of PII, and AES-256 hashing for security.
Methodology: Agile iterative development with testing and evaluation phases assessing precision, recall, false-positive rate, and system uptime.

# Awards:
Capstone Project was nominated for publication in IT Journals/Conferences

# Steps to run:
1. Verify Node.js (v22.11.0) and npm (11.3.0) is installed
   node -v
   npm -v, npm install -g npm@latest
2. Initialize & install dependencies
   npm init -y
   npm install
3. Start the Server
   npm start

