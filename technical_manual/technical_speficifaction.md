# Acclimate Technical Spec
---

## Table of Contents
- [1. Introduction](#1-introduction)
  * [1.1 Overview](#11-overview)
  * [1.2 Glossary](#12-glossary)
- [2. System Architecture](#2-system-architecture)
- [3. High Level Design](#3-high-level-design)
  * [3.1 Data Flow Diagram for Logging In](#31-data-flow-diagram-for-logging-in)
  * [3.2 Data Flow Diagram for Getting Recommended Meeting Time](#32-data-flow-diagram-for-getting-recommended-meeting-time)
  * [3.3 Entity Relationship Diagram](#33-entity-relationship-diagram)
  * [3.4 Business Rules](#34-business-rules)
  * [3.5 Sequence Diagrams](#35-sequence-diagrams)
  * [3.6 Stable Marriage Algorithm Class Diagram](#36-stable-marriage-algorithm-class-diagram)
- [4. Testing](#4-testing)
- [5. Problems and Resolutions](#5-problems-and-resolutions)
- [6. Installation guide](#6-installation-guide)
- [7. Extended Features](#7-extended-features)

---
## 1. Introduction
#### 1.1 Overview

Acclimate is a web application that facilitates a mentorship system for first year students in DCU on the autism spectrum. Settling into university is difficult for anyone and it can be a much greater challenge for students with autism. This web application allows these students to sign up and be paired with a mentor that can help ease them into university life. Mentors are also DCU students who have passed their first year of university and choose to sign up to be apart of the mentorship program. 
Once all students have signed up, or passed a certain deadline, the adminstrator of the system can log on using secure credentials and begin the matchmaking process. This is a fully automated process using a custom algorithm integrated with the Stable Marriage algorithm.
Once all participants are matched, they can use the application to view their partner's profile, chat with them and book meetings. They can also get a recommended time to meet up. The API sends a request to DCU's servers and retrieves both student's timetables, parses through them and uses a custom algorithm to determine a good time for them to meet up.
React.js was used for the user interface to make the experience as quick and responsive as possible. React pre-loads all aspects of the interface and renders them only when necessary so there is no waiting when switching to different parts of the user interface. We designed an API to facilitate communcation between the MySQL database and the React app.

### 1.2 Glossary

- **Mentor**: This is a group of individuals that are currently studying in DCU, have passed their first year in university and sign up on the "mentor" side of the portal to help students with ASD settle into university life.
- **Mentee**: This is a group of individuals with ASD that are entering their first year of study in DCU and have signed up on the "mentee" side of the portal to be assigned a mentor that will help them to settle into university life.
- **ASD**: Autism spectrum disorder (ASD) is the name for a range of similar conditions, including Asperger syndrome, that affect a person's social interaction, communication, interests and behaviour.

---
## 2. System Architecture

![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/system_architecture_diagram.png "system_architecture")

The users of the system all interact with the system through an internet browser. This browser uses the React App to display information to the screen. The React app uses the API to interact with the database, pulling and storing information. The API also sends requests to DCU's servers to retrieve timetable information to parse through student timetables.

---
## 3. High-Level Design

### 3.1 Data Flow Diagram for Logging In

![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/login_dfd.png "login_dfd")

The Login DFD shows the flow of data from the user all the way to the database and the processes and entities that are involved in the flow of data.

### 3.2 Data Flow Diagram for Getting Recommended Meeting Time

![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/get_recommended_time_dfd.png "recommended_time_dfd")

The Recommended Time DFD shows the flow of data from the user to the database via the API, to DCU's servers and back and the processes and entities that are involved in this flow of data.

### 3.3 Entity Relationship Diagram

![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/entity_relationship_diagram.png "erd")

The Entity Relationship Diagram shows the entities within the database and how these entities relate to each other.

### 3.4 Business Rules
**Account Type:**
The Account Type entity is used to distinguish between different users in the system. There are 2 main users, Mentor and Mentee, along with a third account type, Admin, which is capable of making pairs of Mentors and Mentees. It contains a 1:1 relation with the "users" table as each user must have an account type.

**Courses:**
The Course entity is used to give each user a course code representing the current course they’re studying in DCU. It contains a 1:M relationship with the user’s entity type as each course can have many users but each user can only have one course.

**Interests:**
The Interest entity is used to define 3 core interests for each user. This is a major weight in the system's matching algorithm when creating pairs of mentors and mentees. It has a M:M relation with the User entity as each user can have many interests and each interest can have many users. To facilitate this relation a junction table called userinterests was created. Interests contains a 1:M relation with the userinterests.

**Meetings:**
The Meetings entity is used to keep a record of meetings that are set up between a mentor and mentee. Each meeting has a record of the date and time of the meeting along with a short description of the meeting itself. It contains a 1:M relation with the pairings entity.

**Pairings:**
The Pairings entity keeps a record of what mentor and mentee have been paired together. The entity consists of a userID for the mentor and mentee along with a unique ID of its own for use in the meetings entity. 

**Sessions:**
The sessions table is used for keeping a record of a user’s session data. It contains an ID, an expiry date and time, along with session data which is a cookie. This data only exists in the database when a user logs in and is removed after 2 hours.

**Users:**
The users table is the entity that holds the users information. It contains their student number, first name, last name, encrypted password, email address, account type, course code, gender and year of study.

### 3.5 Sequence Diagrams
![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/login_sequence_diagram.png "login_sequence_diagram")

Sequence Diagram for showing the messages sent through the system when the user logs in.

![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/load_dashboard_sequence_diagram.png "load_dashboard_sequence_diagram")

Sequence Diagram for showing the sequence of events that take place when the user navigates to their dashboard.

### 3.6 Stable Marriage Algorithm Class Diagram

![alt text](https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem/raw/master/technical_manual/images/stable_marriage_class_diagram.png "stable_marriage_class_diagram")

The Stable Marriage algorithm works using Object Oriented programming principles. When developing the algorithm, we felt that this programming paradigm was the most logical way to organize and manipulate the data.

---
## 4. Testing
1. Unit tests for the API
When undertaking testing for this project we began with unit tests. The framework we used for this was Mocha.js, the leading unit testing framework for Node.js applications and pyunit, the built-in testing framework for Python. As we were performing the majority of our unit tests on our API, we also included the supertest-sessions library for testing HTTP routes. For a more detailed look on what unit tests we ran and their status, a PDF with a table of tests will be provided.

2. Testing the React App
As we ran our React app in Development Mode for the duration of this project, we took a more informal approach to testing the app. Running the development environment made sure that a majority of unused imports and bad logic were corrected on the fly. We still rigorously tested our logic through constant integration testing. Upon every change to either the React App or the backend API we insisted upon closing down the server and starting it back up from a cold start and attempting to use the system as intended, making any changes to any logical errors that may have come as a result to recent changes.

3. User Interface Testing
A report of the results from our User Interface testing can be found in the "test" directory in the GitLab repository.


---
## 5. Problems and Resolutions

#### Configuration
One of the first problems we encountered was the nature of a React application. React uses Babel to compile JSX code into HTML and JavaScript along with Webpack. Being completely new to React as a library, we were completely unaware of the tedium and effort that came into setting up all the dependencies and configuration files to take advantage of the features React has to offer. Thankfully, React released a module called create-react-app, a JavaScript module that builds all of Babel's and Webpack's configuration files into a single project that allows newcomers to focus on writing React code. This came with its own set of issues however, as these configuration files were obfuscated from us so we were unable to make any changes or implement our own features to the server environment React is running on. After some reading online we decided to build our own RESTful API that would handle the flow of data between the React app and our Database.

#### Change in Requirements
After we had initially spoken with the head of ASD for DCU, Cat Hughes, and obtained our user requirements from her she informed us that she was leaving DCU and that we should get in touch with one of the Occupational Therapists in DCU. We booked a meeting with one of the senior therapists. She was only available to meet us after our Functional Specification had been submitted. She informed us of the flaws of some of the user requirements we had decided on in our meeting with Cat Hughes. She told us that making a system to let mentees book therapy appointments through the application was futile as there was no issue with the current system in place. This feature was removed from our user requirements and so has not been implemented in the final application.

#### Asynchronous Programming
When making GET requests to DCU's servers to retrieve the timetable information, as well as making requests to our database through the API, the single-threaded nature of JavaScript, we had some problems structuring the logic of the timetable parsing algorithm. For this reason, the algorithm itself works in the terminal but we had some problems integrating it into the app itself.

#### Stable Marriage Algorithm
The Stable Marriage algorithm works well but when stress testing it we noticed that it occasionally crashes when a Mentee submits all of their proposals and doesn't get matched. We believe this is an error with the overall logic of the code but did not have time to fully fix it. One of our optimizations helped to reduce the frequency of this problem but it still persists. 

---
## 6. Installation Guide

#### 5.1 Downloading Project files. 
###### If you have git bash installed you can run the command in cmd or mac/linux terminal: 
~~~~
git clone https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem.git
~~~~
This will download the project into the directory of your choosing. 
###### If you do not have this installed you can go here: 
https://gitlab.computing.dcu.ie/aliu2/2019-ca326-uali-autismsupportsystem and beside the link to the github repo you'll see a download button which lets you download the project in a variety of different compression formats.

#### 5.2 Installing Node.js and Node modules.
To run the application the user must first make sure Node.js is installed in the system. A link to do so can be found here: https://nodejs.org/en/. Once Node.js is installed and is configured in your PATH, progress to the "code" directory of the project. There will be two main folders: APP and API. For the API folder, open it and open a terminal or cmd prompt.

Run this command:

~~~~ 
npm install
~~~~ 

This will now download all the required modules to run the API. 

Then, change directories into the APP folder and run the same command:
~~~~ 
npm install
~~~~ 

You should now have all the required node modules to run the application.

### 5.3 Importing the database.
To run the app you will need a running version of MySQL Server, or XAAMP as it comes with phpMyAdmin. For this installation guide we will cover how to get the application running with phpMyAdmin and XAAMP. You can download XAAMP here: https://www.apachefriends.org/index.html and follow the installation on their website.

Once you've followed the instructions during the download, open the XAAMP control panel. Press the start buttons for APACHE and MySql (APACHE runs on port 80 & 443 and MySQL runs on port 3306. If you have other processes that use these ports, you will have to end them or use the config button on the control panel to change what ports they run on). 

Once you have XAAMP, running go to your browser and type http://localhost/phpmyadmin/index.php into the address bar. This will take you to the home screen for phpMyAdmin. At the top of the page you will see a navigation button called "User accounts", click it. On this page, create a user of your choice. Make sure to set the **host** of the user to **localhost**, then go back to the homepage by clicking the phpMyAdmin logo in the top left of the page. 

On the left hand side of the screen you will see a list of dummy databases. Click the "New" button and create a new database called "acclimate".

Click into that database and you will then see a navigation button on the top labelled "SQL", click it. Now, go back to the project folder. In the code folder there will be a folder named 'DB' _(2019-ca326-uali-autismsupportsystem\code\DB)_. In this directory you'll find a file called acclimate.sql. Open it and in a text editor and copy the whole file to your clipboard (ctrl+a and then ctrl+c on Windows, cmd+a and then cmd+c on Mac). 

Now you've copied the schema from the file, go back to the SQL page on your browser and paste that schema into the text area and press the "Go" button in the bottom right. You will then have loaded your acclimate database with the required data. 

The final step for this part involves opening up the app.js file, found in the API folder (2019-ca326-uali-autismsupportsystem\code\API). At the top of the file, you will find a variable called "options", with a list of credentials for the database. Input the credentials that you created earlier when making an account on phpMyAdmin.

### 5.3 Running the app
Open a cmd prompt or Mac/Linux terminal in both the APP folder and API folder. 

In the API folder run the command:

~~~~ 
node app.js
~~~~

The file will run and you'll see the prompt on screen "Listening on port 4000!". 

In the APP folder, run the command:

~~~~
npm start
~~~~

This will take a bit longer to load, 6-7 seconds depending on your machine, but once it starts it will automatically open a tab or window in your default browser on the app's homepage. You will then be able to use the application as intended.


---
## 7. Extended Features
- Allow users to edit their profiles after they have registered.