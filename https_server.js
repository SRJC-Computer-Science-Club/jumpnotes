var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('ssl_certificates/key.pem'),
  cert: fs.readFileSync('ssl_certificates/cert.pem')
};

// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

app.use(express.static('public'));


/*

how to test

run this command on ubuntu
curl -k https://localhost:8000
*/