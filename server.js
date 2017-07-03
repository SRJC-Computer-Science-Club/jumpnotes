/*
JumpNotes server 
by Oran Collins
Date 07/2/2017

this handls the saving/deletion/update of 
notes stored on the jumpnote app into a mongodb
database
for more info checkout the github 
https://github.com/SRJC-Computer-Science-Club/jumpnotes/
*/
var mongoClient = require('mongodb').MongoClient;
var express = require('express');
var https = require('https');
var http = require('http');
var opn = require('opn');
var fs = require('fs');








/*
Global settings
*/
var serverPort = 443;
var databaseName = 'database'
var url = "mongodb://localhost:27017/" + databaseName;
var doesItExist = 0;
//https://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server/
//https://stackoverflow.com/questions/31156884/how-to-use-https-on-node-js-using-express-socket-io#31165649
var options = {
  key: fs.readFileSync('ssl_certificates/key.pem'),
  cert: fs.readFileSync('ssl_certificates/cert.pem')
};







/*
----------------------
server setup
----------------------
*/
var app = express();
var server = https.createServer(options, app);
var io = require('socket.io')(server);

opn('https://localhost:'+serverPort);

/*
desplying index.html on client 
by sending the file statically
*/
app.use(express.static(__dirname + '/public'));








/*
----------------------
for people who try to go to non https
version of the client
----------------------
*/
var redirect = express();
redirect.use(express.static(__dirname + "/404/")); //use static files in ROOT/public folder

redirect.get("/", function(request, response){ //root dir
    response.send("You visited the wrong url please click here https://localhost:443");
});

redirect.listen(80, "127.0.0.1");

























/*
----------------------
setup sockets and events that
are triggerd on socket connection
----------------------
*/
var clientConnection =  new Sockets();

io.on('connection', newConnection);



server.listen(serverPort, function() {
	console.log("JumpNotes is Running....");
	console.log('Address : https://localhost:%s',serverPort);
});










/*
----------------------
Client connecting to server
----------------------
*/
function newConnection(socket){

	clientConnection.add(socket);








	/*
	----------------------
	save note to database when s
	client calls emit("text", JSON objec with note data inside)
	----------------------
	*/
	socket.on("save", function(data){
		socket.emit('save', data);
		saveNote(data);
	});







	/*
	----------------------
	prints all of database to console
	when client calls emit("print", {id:0, title:" ", text" ""}) 
	----------------------
	*/
	socket.on("print", function(data){
		socket.emit('print', data);
		printNotes();
	});









	/*
	----------------------
	 clears all notes on database server
	----------------------
	*/
	socket.on("clear", function(data){
		socket.emit('clear', data);
		wipeDatabase();
	});








	/*
	----------------------
	removes one note with the id of {id: X}
	example client code
	socket.emit("removes", {id:8});
	----------------------
	*/
	socket.on("remove", function(data){
		socket.emit('remove',data);
		removeNote(data);
	});


}

























/*
----------------------
 saves notes to mongo database
 notes come in the form of json objects
 EI
 data = {
		    "id": 5,
		    "title": "My first Awesome Note!",
		    "noteText": "Idea for greate new book title Brave New World"
		}

and are saved by issueing the command
db.< name of database >.insert(data)

then it closes that connction
----------------------
*/
function saveNote(clientNote){

	print("Note Saved : " );

	print(clientNote);

	//check if all the fields are correct
	validateJson(clientNote);

	mongoClient.connect(url, function(err,db){
		//TODO DOMAIN HERE
		if (err) throw err;

		db.collection(databaseName, function(err, collection){
			//TODO DOMAIN HERE
			if (err) throw err;

			db.collection(databaseName).insert(clientNote);

			db.close();

		});

	});

}








/*
----------------------
 prints all notes stored in the mongo database
 uses .find().toArray() to output
 all the notes as a string

 and .count() to find total number of
 notes
----------------------
*/
function printNotes(){
	mongoClient.connect(url, function(err,db){

		db.collection(databaseName, function(err, collection){
			//TODO DOMAIN HERE
			if (err) throw err;

			db.collection(databaseName).find().toArray(function (err, result) {
				//TODO DOMAIN HERE
				if (err) throw err;

				db.collection(databaseName).count(function (err, totalNotes) {
					//TODO DOMAIN HERE
					fancyPrint(result, totalNotes);

				});

			});

		});

	});

}








/*
----------------------
 deletes all notes from database
 by calling the mongodb function
 db.<database name here>.remove({})
 which removes all notes
----------------------
*/
function wipeDatabase(){

	try{


		mongoClient.connect(url, function (err, db) {
			//TODO DOMAIN HERE
			if (err) throw err;

			db.collection(databaseName, function (err, collection) {
				//TODO DOMAIN HERE
				if (err) throw err;

				db.collection(databaseName).remove({});

				print("\nAll Notes Deleted!\n");

			});

		});


	}catch(err){

		print("ERROR : " + err);

	}

}









/*
----------------------
Delete a specific note in database
this is done by selecting an "ID"
of the note and passing that in a
JSON object like this

data = { id: X }
x being the notes id


to select the note with id = 5

 {
    "id": 5,
    "title": "My first Awesome Note!",
    "noteText": "Idea for greate new book title Brave New World"
}

you need to send call

> removeNote({id:5})

----------------------
*/
function removeNote(clientsNote){
	mongoClient.connect(url, function(err,db){
		//TODO DOMAIN HERE
		if (err) throw err;

		db.collection(databaseName, function(err, collection){
			//TODO DOMAIN HERE
			if (err) throw err;

			db.collection(databaseName).find(clientsNote).count(function (err, totalNotes) {

				doesItExist = totalNotes;

			});

			db.collection(databaseName).count(function (err, totalNotes) {
				//TODO DOMAIN HERE
				try{

					if(totalNotes === 0) throw "Empty Database, None to remove";
					if(doesItExist === 0) throw "No node with that ID";

					doesItExist = 0;

					db.collection(databaseName).remove(clientsNote);

					print("\nDeleted Note With ID : " + clientsNote.id + "\n");

				}catch(err){

					print("ERROR : " + err);

				}

			});

		});

	});

}






















/*
----------------------
 prints the contents of notes
 in a cleaner way
----------------------
*/
function fancyPrint(result,totalNotes){

var output = '\n\n\n\n\n';

	try{



		if(result.length === 0){ 

			throw "Empty Database; nothing to print";

		}else{

			for( var i = 0; i < result.length; i++){

				output +=  "id: "+ result[i].id    + "\n" 
								 + result[i].title + "\n" 
								 + result[i].text  + "\n" 
								 + "-----------"   + "\n";

			}
			print(output + "\nTotal : " + totalNotes);
		}



	}catch(err){

		print("ERROR : " + err);

	}

}







/*
-----------------------------
Small Sockets class that handls 
socket tags better
more info/documenation
//https://stackoverflow.com/questions/18654173/emiting-with-exclusion-in-socket-io
----------------------------
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
 verify that all the data in the
 note
----------------------
*/
function validateJson(note){
	if(typeof note.id === "undefined") throw "ID is undefined!";
	if(typeof note.title === "undefined") throw "Title is undefined!";
	if(typeof note.text === "undefined") throw "Text is undefined!";
	/*
	if( note.id === null ) throw "id is null";
	if( !isNumeric(note.id) ) throw "id is not a number";
	if( note.title === null ) throw "title is NULL!";
	if( note.text === null ) throw "text is NULL!";
	if( typeof note.title !== 'string' ) throw "title is not a string";
	if( typeof note.text !== 'string' ) throw "text is not a string";
	if( note.title === '' && note.text === '' ) throw "Json object is empty!";
*/
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
check if string is a number
https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
----------------------
*/
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

