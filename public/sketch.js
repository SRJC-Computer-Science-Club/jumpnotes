var socket;


var title, 
	noteText,
	saveButton, 
	printButton,
	clearBtn,
	deleteBtn,
	idText;

var noteID = 0;


var defaultText = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks";






/*
----------------------

----------------------
*/


function setup() {

	createCanvas(400,400)
	background(50);

	titleInput(0);
	noteInput(60);
	idInput(-30);

	sendButton();
	printConsole();
	clearButton();
	deleteButton();


  	setupSocket();
	
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
create sockets and initialize there
socket tags, 
tags filter the data beeing sent on the server side

----------------------
*/

function  setupSocket(){

	//inisiate the connection to server
	socket = io.connect('http://localhost:3000');

	socket.on('text', function(data){
			console.log("Text Works");
		}
	);




	socket.on('text',
	 

		function(data) {
			console.log("Note receive from server :\n ID :" + data.title + ",    " + data.text);

			
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
function deleteButton(){

	deleteBtn = createButton('delete');
	deleteBtn.position(width/2-50, height/2+75);
	deleteBtn.mousePressed(deleteNote);


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

		console.log("Sent note to server : ");// + title.value());

		print(note);
		//print(parseInt(idText.value()));
		socket.emit('text',note);



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
var  deleteNote = function(){
	try{

		if( idText.value() === "" ) throw "No index selected";

		if(  !isNumeric(idText.value()) ) throw "That is not at number";

		var noteIndex = {
			"id": parseInt(idText.value()) 
		}

		socket.emit('delete', noteIndex);

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






