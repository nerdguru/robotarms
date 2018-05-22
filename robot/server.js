#!/usr/bin/node

// Set up robot arm connection
var adaFruit = require('adafruit-pca9685');
var arm = adaFruit();

// servo enumerations
var wrist = 0;
var lowerarm = 2;
var upperarm = 4;
var shoulder = 6;

// Set up simple HTTP server and query string parsing
var http = require('http');
var url = require('url');
var querystring = require('querystring');

http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-type': 'text/plan' });
  query = querystring.parse(url.parse(request.url).query);
  response.write('Set arm to X: ' + query.x + ' Y: ' + query.y + ' Z: ' + query.z);
  response.end();

  console.log(query);
  if (query.x != null) {
    arm.setPulse(shoulder, query.x);
    arm.setPulse(lowerarm, query.y);
    arm.setPulse(upperarm, query.z);
  }
}).listen(8090);
