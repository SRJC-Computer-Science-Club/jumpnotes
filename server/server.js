// port of client web addres for testing 
var PORT = 3000;







/*
----------------------

----------------------
*/
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




/*

Create a socket that the client app connects to 
and every other client can acess

*/

var clientSockets =  new Sockets();





io.on('connection', newConnection);


function newConnection(socket){
    
      clientSockets.add(socket);

      socket.on("text", function(data){

          printNote(data);


        }
      );
}







/*
----------------------
takes json object and saves it to the
mongodb database
----------------------
*/
function saveNotetoDatabase(){

}








/*
----------------------
takes in the json object 
like this one
{
    "id": 1,
    "title": "My first Awesome Note!",
    "noteText": "Idea for greate new book title Brave New World"
}

output

Note :
My first Awesome Note!
Idea for greate new book title Brave New World
____________________________________
----------------------
*/
function printNote(Note){
  if(Note.title !== '' || Note.text !== ''){
    console.log("");
    console.log("Note : ");
    console.log(Note.title);
    console.log(Note.text);
    console.log("____________________________________");
  }
}









/*

Small Sockets class the handless socket tags better
for documenation
//https://stackoverflow.com/questions/18654173/emiting-with-exclusion-in-socket-io


*/
function Sockets() {
  this.list = [ ];
}
Sockets.prototype.add = function(socket) {
  this.list.push(socket);

  var self = this;
  socket.on('disconnect', function() {
    self.remove(socket);
  });
}
Sockets.prototype.remove = function(socket) {
  var i = this.list.indexOf(socket);
  if (i != -1) {
    this.list.splice(i, 1);
  }
}
Sockets.prototype.emit = function(name, data, except) {
  var i = this.list.length;
  while(i--) {
    if (this.list[i] != except) {
      this.list[i].emit(name, data)
    }
  }
}