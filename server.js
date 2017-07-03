// port of client web addres for testing 
var PORT = 3000;
var databaseName = 'database';

var url = "mongodb://localhost:27017/" + databaseName;






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
var mongoClient = require('mongodb').MongoClient;
var opn = require('opn');

opn('http://localhost:'+PORT);
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
 

console.log("JumpNotes is Running....");
console.log("Address : http://localhost:" + PORT);




/*

Create a socket that the client app connects to 
and every other client can acess

*/
var clientConnection =  new Sockets();


io.on('connection', newConnection);


function newConnection(socket){
    
      clientConnection.add(socket);


      socket.on("text", function(data){

        socket.emit('text',data);

         saveNotetoDatabase(data);      

      });



      //print to console if socket has tag print
      socket.on("print", function(data){

        socket.emit('print',data);

        printDatabase();
      });




      socket.on("clear", function(data){

        socket.emit('clear',data);
          clearDatabase();
      });



/*
      socket.on("delete", function(data){

        socket.emit('delete',data);

        deletePop();
      });
*/
      
}







/*
----------------------
takes json object and saves it to the
mongodb database
----------------------
*/
function saveNotetoDatabase(data){
    
    try{

        validateText(data);

        //printNote(data);

        mongoClient.connect(url, function(err,db){

            db.collection(databaseName, function(err, collection){
                if (err) throw err;

                collection.insert(data);
                db.close();
              }
            );
          }
        );
    }catch(err){
      console.log("ERROR : " + err);
    }
}








/*
----------------------
Prints all items in database
----------------------
*/
function printDatabase(data){

 
   mongoClient.connect(url, function(err,db){

      db.collection(databaseName, function(err, collection){

          db.collection(databaseName).find().toArray(function (err, result) {

           

            db.collection(databaseName).count(function (err, count) {
                  console.log(count);
            });

            printFormated(result)
          });
        });
    });

}











/*
----------------------
clears everything in the database
https://stackoverflow.com/questions/28454380/efficient-way-to-remove-all-entries-from-mongodb#28454476
https://stackoverflow.com/questions/16743729/mongodb-find-if-a-collection-is-empty-node-js#16743950
----------------------
*/
function clearDatabase(){
var numOfnotes = 0;
   mongoClient.connect(url, function (err, db) {
        
        db.collection(databaseName, function (err, collection) {

         /* try{


            db.collection(databaseName).count(function (err, count) {
                numOfnotes = count;
              });


            if(numOfnotes === 0)
             throw "Database us empty, nothing to clear";
*/
            print("Cleared database!");
            db.collection(databaseName).remove({});

/*
           
              
          }catch(err){

            print("ERROR : " + err);
          }
      
*/
        });
                    
    });
}





/*
----------------------

----------------------
*/
function deletePop(){
  print("ToDo")
}






/*
----------------------

----------------------
*/
function printFormated(result){

  var output = 'Note : ';

  try{


      if(result.length === 0){ 

        throw "Database is empty, nothing to print";

      }else{
        
        for( var i = 0; i < result.length; i++){

          output +=  "\n" + result[i].title + "\n" + result[i].text + "\n " + "-----------" + "\n";

        }

        console.log( output );
      }



  }catch(err){

    print("ERROR : " + err);

  }
}








/*
----------------------
data validation
----------------------
*/
function validateText(data){
      if(data.title === null) throw "title is NULL!";
      if(data.text === null) throw "text is NULL!";
      if(typeof data.title !== 'string') throw "title is not a string";
      if(typeof data.text !== 'string') throw "text is not a string";
      if(data.title === '' && data.text === '') throw "Json object is empty!";
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








/*
----------------------
simple print function
----------------------
*/

function print(text){
  return console.log(text);
}