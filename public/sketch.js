var socket;    
//var URL_SERVER = 'https://localhost:443';
//var URL_SERVER = 'https://192.168.1.12:443';
var URL_SERVER ='';// 'https://localhost:80';

var title, 
	noteText,
	saveButton, 
	printButton,
	clearBtn,
	removeBtn,
	idText,
	ipaddress,
	ipaddrBtn;

var noteID = 0;


var defaultText = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";






/*
----------------------

----------------------
*/


function setup() {

	createCanvas(400,400)
	background(50);

	ipaddressfield(90);

	ipButton();
	


	titleInput(0);
	noteInput(60);
	idInput(-30);

	sendButton();
	printConsole();
	clearButton();
	removeButton();


  	
	
}
function draw() {}





/*
----------------------
create input text field in middle of
screen
----------------------
*/
function titleInput(pos){

	title = createInput();
	title.position(width/2, height/2 + pos);


}






/*
----------------------
create input text field in middle of
screen
----------------------
*/
function noteInput(pos){

	noteText = createInput();
	noteText.position(width/2, height/2 + pos);


}






/*
----------------------
for entering the id of a note
----------------------
*/
function idInput(pos){

	idText = createInput();
	idText.position(width/2, height/2 + pos);

}






/*
----------------------
----------------------
*/
function ipaddressfield(pos){

	ipaddress = createInput();
	ipaddress.position(width/2, height/2 + pos);

}







/*
----------------------
create sockets and initialize there
socket tags, 
tags filter the data beeing sent on the server side

how to create a action on socket tag incoming

	socket.on('text', function(data){
			console.log("Text Works");
		}
	);

----------------------
*/

function  setupSocket(){

	//inisiate the connection to server
	socket = io.connect(URL_SERVER);

	socket.on('message', function(data) {
	alert(data);
	});
	


	socket.on('text',
	 

		function(data) {

			console.log("Receive from Server \nID : " + data.id + ",\nTitle : " + data.title + ",\nText : " + data.text);

			
			fill(50);
			rect(0,0, width,height);

            fill(255);
            textSize(32);

			text(data.title, width/2, height/2 + 92 ); 
			text(data.text, width/2, height/2 + 92 + 32); 


	    }
	  );
}







/*
----------------------

----------------------
*/
function sendButton(){

	saveButton = createButton('Save');
	saveButton.position(width/2-50, height/2);
	saveButton.mousePressed(sendNoteToServer);


}









/*
----------------------

----------------------
*/function printConsole(){

	printButton = createButton('Print');
	printButton.position(width/2-50, height/2+25);
	printButton.mousePressed(printDatabase);


}







function clearButton(){

	clearBtn = createButton('clear');
	clearBtn.position(width/2-50, height/2+50);
	clearBtn.mousePressed( clearDatabase);


}







/*

----------------------

----------------------
*/
function removeButton(){

	removeBtn = createButton('remove');
	removeBtn.position(width/2-50, height/2+75);
	removeBtn.mousePressed(removeNote);


}






/*

----------------------

----------------------
*/
function ipButton(){
	var setIP = function(){
		URL_SERVER = 'http://'+ ipaddress.value();
			alert(URL_SERVER);
			setupSocket();
	}
	ipaddrBtn = createButton('ip');
	ipaddrBtn.position(width/2-50, height/2+90);
	ipaddrBtn.mousePressed(setIP);

}








/*

----------------------

----------------------
*/
var  sendNoteToServer = function(){
	try{

		if(title.value() === "" && noteText.value() ==="") throw "Nothing to send, empty note";

		var note = {
			id: noteID,
			title: title.value(),
			text : noteText.value()
		}
		
		noteID += 1;
		
		print("____________________________")

		print("JSON Object sent to server : ");// + title.value());

		print(note);

		print("____________________________")



		socket.emit('save',note);



	}catch(err){

		print("ERROR : " + err);


    	if(err === "Nothing to send, empty note"){
    		alert("ERROR : " + err);
    	}
	}
}








/*
----------------------

----------------------
*/
var  printDatabase = function(){
	socket.emit('print',{});

}






/*
----------------------

----------------------
*/
function update(data){
	socket.emit('update',data);

}







/*
----------------------

----------------------
*/
var  removeNote = function(){
	try{

		if( idText.value() === "" ) throw "No index selected";

		if(  !isNumeric(idText.value()) ) throw "That is not at number";

		var noteIndex = {
			"id": parseInt(idText.value()) 
		}

		socket.emit('remove', noteIndex);

		console.log(noteIndex);

	}catch(err){

    	print("ERROR : " + err);

    	if(err === "That is not at number"){
    		alert("ERROR : " + err);
    	}

    	if(err === "No index selected"){
    		alert("ERROR : " + err);
    	}
	}	
		

}








/*
----------------------

----------------------
*/
var  clearDatabase = function(){
	socket.emit('clear',{});

}








/*
----------------------
https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
----------------------
*/
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}






