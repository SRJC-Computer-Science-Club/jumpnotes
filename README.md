
# JumpNote

![Mockup](https://i.imgur.com/f2sGV4e.png)

[![Stories in Ready][Issues In Progress]][Waffle.io] [![Stories in Needs Review][Issues Needs Review]][Waffle.io]

---------------
### About this project


**JumpNote** is a *Simple, Quick, Easy to use*, Note **taking app** that "automagically"  backups everything to a server.
Using the hottest new technology we built **JumpNote** using ***React Native*** for the app frontend, ***Node.js*** for the backend server magic, and used ***Mongodb*** to implement our database.  


----------

# How to join and understand this project

## Getting started

### Download

- You can [download](https://github.com/SRJC-Computer-Science-Club/jumpnotes/archive/master.zip) latest installable version of JumpNote for Windows, macOS and Linux.

- git clone the repo

   > git clone https://github.com/SRJC-Computer-Science-Club/jumpnotes.git

-----------
### Software Installation

Follow these instructions to get everything you need installed.

- Install **Node.js**
 -  **Windows** installation here [Node.js on Windows] 

 -  **Mac** installation here [Node.js on Windows]
 
 -  **Ubuntu** installation here [Node.js on Windows] 

- Install **MongoDB**

  -  **[Windows](https://www.mongodb.com/download-center?jmp=nav#community)** :  installation  [click](https://stackoverflow.com/questions/2404742/how-to-install-mongodb-on-windows#20189138) here for Windows

     -  Click [Here](https://www.lynda.com/Moodle-tutorials/Install-MongoDB-Windows/573253/611677-4.html) for video
 -  **[Mac](https://www.mongodb.com/download-center?jmp=nav#community)** :   installation  [click](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) here for Mac


     - Click [Here](https://www.youtube.com/watch?v=-GE2DpwfbW0) for video
    -  **[Ubuntu](https://www.mongodb.com/download-center?jmp=nav#community)** :   installation  [click]( https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu-16.04/) here for Ubuntu
     -  Click [Here](https://www.youtube.com/watch?v=-GE2DpwfbW0) for video

--------------------
### Setup/Run Server
 
 After you have finished installing all the software correctly you can now
 clone the repo into a folder of your choosing and run the server.

To get started:

- open up cmd( command prompt ) for windows, terminal for Mac and Linux
- Download [This file](https://github.com/SRJC-Computer-Science-Club/jumpnotes/archive/master.zip)
-  Go to you Downloads folder
-  Unzip  
   >jumpnotes-master.zip
      Clone this repository
    > git clone https://github.com/SRJC-Computer-Science-Club/jumpnotes.git
    
  -  If `git` is not installed it can be download [here](https://desktop.github.com/)
  
 Go into the repository
    > cd jumpnotes-master
    
     Install dependencies
    > npm install
    
   Start Mongodb server
   >npm start_mongdb
   
  > - if npm start_mongdb does not work for you try running
  
  > mongod --dbpath "data"
   
     Run the app
    > npm start
   


  
----------
How It Works
-------
![Diagram of Dataflow](https://i.imgur.com/MgbII7K.png)

*How the data flows from server and clients*

---
**Client** - The notes app has a open connection to the server that is located at the address `http://localhost:3000` on the physical server.
When the Client request to the server the server sends back a a JSON object like this one

Example
```
{
    "id": 1,
    "title": "My first Awesome Note!",
    "noteText": "Idea for greate new book title Brave New World"
}
```
---
**Server** - The get and processed the json object like above, and  sends them to the mongodb 
server ( located at the address `mongodb://localhost:27017/Notes`) to be added to the database. 
  The server **saves ** data to the database by sending a json object that is saved by issuing the `db.collection.insert()` an example would look like
  
    db.collection.insert(
      {
        "id": 1,
        "title": "My first Awesome Note!", 
        "noteText": "Idea book title Brave New World" 
        }
    )

---
### Example in calling from Javascript

Here is what it looks like to call db.collection.insert() inside the Server (*note this doesnt work outside the server app)*
  

  var MongoClient = require('mongodb').MongoClient;
  /*Data to be saved in database*/  
    
                // The Name of the database
                     //|    
                     //V
    var URL = "mongodb://localhost:27017/Notes";
  
    var DATA = {
             "title": "My first Awesome Note!", 
             "noteText": "Idea book title Brave New World" 
           }
           
        
    MongoClient.connect(URL, function (err, db) {
   
    // select the name of the database
           //|    
           //V
        db.collection('Notes', function (err, collection) {
            
            collection.insert( DATA );
            
            db.close();
            
        });          
    });
  
-------
Understating Node.js
---------------------

Learn the basics of **Node.ls**, **Express.js**  ---------------Click [here](https://www.rithmschool.com/courses/node-express-fundamentals/introduction-to-node-js)

Built with
----------

- **[Node.js](https://nodejs.org/)**
In this project we used the following frameworks, library's and software.

- **[MongoDB](https://www.mongodb.com/)** : is a free and open-source cross-platform document-oriented database
- **[Node.js](https://nodejs.org/)** :  an open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side.
 - **[Express](https://expressjs.com/)** : is a minimal and flexible Node.js web application framework
 -  **[mongodb](https://www.npmjs.com/package/mongodb)** : is an MongoDB driver for Node.js. Provides a high-level API on top of mongodb-core that is meant for end users.
 -  **[Socket.io](https://socket.io/)** : creates real-time bidirectional event-based communication in **node.js**
-  **[React Native](https://facebook.github.io/react-native/)** : open-source framework allowing you to build fully native apps in JavaScript  

----------

Licence
----------
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.





[Waffle.io]:https://waffle.io/SRJC-Computer-Science-Club/cs-app-react-native
[Issues Ready]:https://badge.waffle.io/SRJC-Computer-Science-Club/cs-app-react-native.png?label=issues&title=Ready
[Issues In Progress]:https://badge.waffle.io/SRJC-Computer-Science-Club/cs-app-react-native.png?label=in+progress&title=In-Progress
[Issues Needs Review]:https://badge.waffle.io/SRJC-Computer-Science-Club/cs-app-react-native.png?label=needs+review&title=Needs+Review

[React]:https://facebook.github.io/react-native/docs/getting-started.html
[Node.js on Windows]:http://blog.teamtreehouse.com/install-node-js-npm-windows
[Node.js on Mac]:http://blog.teamtreehouse.com/install-node-js-npm-mac
[Node.js on Ubuntu]:https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04








