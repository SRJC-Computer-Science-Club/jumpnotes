var socket;


var title, noteText, button;


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

	sendButton();



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
			console.log("Note receive from server : " + data.title + ",    " + data.text);
			fill(color(255,0,0));
			rect(width/2,height/2, 50,50);
	    }
	  );
}







/*
----------------------

----------------------
*/
function sendButton(){

	button = createButton('Save');
	button.position(width/2-50, height/2);
	button.mousePressed(sendNoteToServer);


}







/*
----------------------

----------------------
*/
var  sendNoteToServer = function(){


	console.log("Sent note to server : " + title.value());

	var note = {
		title: title.value(),
		text : noteText.value()
	}


	socket.emit('text',note);

}