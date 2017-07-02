var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('ssl_certificates/key.pem'),
  cert: fs.readFileSync('ssl_certificates/cert.pem')
};

var app = https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);


/*

how to test

run this command on ubuntu
curl -k https://localhost:8000
*/