// port of client web addres for testing 
var PORT = 3000;
var databaseName = 'database';

var url = "mongodb://localhost:27017/" + databaseName;

var cmd = 'start cmd /k mongod --dbpath data';




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

d - is a domain that handls errors and makes sure they dont crash the server
domain how to https://engineering.gosquared.com/error-handling-using-domains-node-js
			  https://stackoverflow.com/questions/20689768/how-to-ensure-node-js-keeps-running-after-monogdb-connection-drops
exec - executes a command ie restarting the mongodb server
exec how to https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js#20643568
*/
var app  = express();

var server = app.listen(PORT);

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

var d = require('domain').create();

var exec = require('child_process').exec;



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

      	print(" Data Resived : " );

      	print(data);


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




      socket.on("delete", function(data){

        socket.emit('delete',data);

        deleteNote(data);
      });

      
}







/*
----------------------
takes json object and saves it to the
mongodb database
----------------------
*/
function saveNotetoDatabase(data){
   

/*
//TODO error domains


    d.run(function() {

			

			exec(cmd, function(error, stdout, stderr) {
			  // command output is in stdout
			});

	});
*/	

	    try{

	        validateText(data);

	        //printNote(data);

	        mongoClient.connect(url, function(err,db){

				if (err) throw err;

	            db.collection(databaseName, function(err, collection){

	               if (err) throw err;

	                db.collection(databaseName).insert(data);
	                db.close();
	              }
	            );
	          }
	        );

	    }catch(err){

	      console.log("ERROR : " + err);

	    }








/*
//TODO error domains


       d.on('error', function(er) {


		print("ERROR : Can't connect to Database Server!");

        //exec(cmd, function(error, stdout, stderr) {	});

   		 });
  */
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
	try{
		var numOfnotes = 0;

		mongoClient.connect(url, function (err, db) {
		    
		    if(err) throw err;//" Problem with mongoClient.connect()";

		    db.collection(databaseName, function (err, collection) {

		    	if(err) throw err;//" Problem  db.collection()";


		        db.collection(databaseName).remove({});

				print("Cleared database!");

			});
		                
		});


	}catch(err){

		print("ERROR : " + err);

	}

}








/*
----------------------
Deletes a note in the database by 
selecting the notes "id"
example note to be deleted

{
    "id": 5,
    "title": "My first Awesome Note!",
    "noteText": "Idea for greate new book title Brave New World"
}

to delete this note we send

deleteNote({"id":5});
----------------------
*/
function deleteNote(data){


   mongoClient.connect(url, function(err,db){

      db.collection(databaseName, function(err, collection){

      	if(err){ print(err); }

          db.collection(databaseName).remove(data);
        
        });
    });


  print("Deleted Note : " + data.id );
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

          output +=  "\n id: " + result[i].id + "\n" +result[i].title + "\n" + result[i].text + "\n " + "-----------" + "\n";

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
	if(data.id === null) throw "id is null";
	if(!isNumeric(data.id)) throw "id is not a number";
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








/*
----------------------
https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
----------------------
*/
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}