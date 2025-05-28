# Tear-n-Share - A dynamic single page React application for users to share the cost of baked goods with other users within their local area

## Tech Stack

- HTML
- CSS
- Javascript ES6
- React
- React Leaflet
- Firebase (Auth + Firestore)
- UUID


## Key Project Features


- User registration & authentication using Firebase Auth
- Real time data sync with Firebase Firestore
- Responsive single page UI application design
- ability to view users within local area using map based distance logic applied visually using React leaflet
- Matchmaking logic between users based on sent and received request acceptance
- Matched user management system with built in time stamped activity tracker & dynamic calendar display setup.
- in-built chat function to allow communication between matched users
- Real time notification management to alert users to recent activity


## Local Setup Instructions


```
//Clone the repo
git clone git@github.com:Wolfson-1/tear-n-share.git


//Navigate into the project
cd tear-n-share


// Install dependencies
npm install


// Start the dev server
npm run dev


```


## Learning goals & Aims With This Project


I took on this project idea for a few reasons. Initially, the idea of creating an application with the purpose to help its users reduce the cost of their groceries via sharing or even bulk buying is something I am passionate about as an idea. And although a specific application focused just on bread & bakery products is rather limited in its scope...This project acts as a perfect proof of concept I hope to build on and expand in the future. 


As a concept I am passionate about I started to plan out the design & features of this project. It was my belief that this would also demonstrate a wide range of skills I have for the purpose of applying to entry front end web development positions whilst building on & improving these skills at the same time.


Being a single page application gives the project a modern look & feel highlighting the relevance of my skill set within a modern company in need of web developers. Whilst also demonstrating my capabilities to run the end to end development of a full stack user based project.


## Known Issues & Planned Improvements


### Planned Improvements


- distance unit toggle so logged in user can choose between miles and kilometers & have this factored into map distance logic
- the addition of firebase storage for the following purposes:
   - User upload of a profile picture on account creation as well as ability to change profile picture in account settings
   - Add images for proof of purchases and payment to other users in activity tracker of matched users
- Further aesthetic improvements using CSS for the purpose of coordinating application style across all segments.
- Mobile & smaller screen CSS addition. Currently setup only to work on full screen 
- Addition of further react context/reduce functionality to enable ability click on notifications to take user to the section affiliated (eg: clicking a notification of a new message from a matched user takes logged in user to that chat window)
- Addition of regex qualification of users email, username, and password upon account creation.


### Known Issues


- Refinement needed in filtering users to specific distance area algorithm. Currently an application scaling risk where initially all created users are fetched from the back end before filtering & rendering map. As application grows in users, this will cause a crash.
- bug where if user enters wrong user/password combination on login sometimes page needs refreshing prior to log in then working. Likely an issue in clearance of previous form values and/or error value before retrying login attempt.


## Feedback and Contact Info


---


As this project still remains one of my first full stack projects & I am looking to improve anywhere I can in my coding journey, any feedback is most welcome. Please feel free to open an issue or message me via my github account.


---


## License


This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).