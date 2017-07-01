// port of client web addres for testing 
var PORT = 3000;


/*

import all the nessisary packages and 
create objects that will be refrenced*/

/* 

MongoClient - the reason it is importing the client
is because the server is a client of the
mongodb server running on localhost:27017

*/

var http = require('http');
var express = require('express');

var MongoClient = require('mongodb').MongoClient;


/*


add - creates a express server object
app.use(express.static()) - tells express to use the 
html file stored in the directory /public ie public/html
socket - creates a socket.io socket for handing connections
var io = socket(server);  - attaches a socket to the webserver
*/
var app  = express();

var server = app.listen(PORT);

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);
 

console.log("JumpNotes Server Has Started!");
console.log("Address : http://localhost:" + PORT);