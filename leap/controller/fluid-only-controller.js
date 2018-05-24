#!/usr/bin/node

// This version of the controller uses the fluid URL only.  At startup, it
// will grab the 'fluidRobotURL' out of config.json, call Function Router and
// loop over Leap frames.  As a frame comes in, it will call the OpenWhisk
// end point  with the Leap coordinates and get back coordinates for the robot
// arm, which it then passes onto Pi referenced in 'fluidRobotURL'.  It ignores
// frames that come in while this processing is happening.

require('../template/entry');
var fs = require('fs');

// Load up the config file
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
console.log(JSON.stringify(config, undefined, 2));

var lookupURL = config.frURL + '/' +
                config.serviceID + '/' +
                config.functionName +
                '?latitude=' + config.latitude + '&' +
                'longitude=' + config.longitude + '&' +
                'accessToken=' + config.accessToken;

// Perform the Function Router Lookup
var request = require('request');
var lookupDate1 = new Date();
var eeIP = '';
var eeAuth = '';
console.log('Lookup trying: ' + lookupURL);
request(lookupURL, function (error, response, body) {
  if (!error) {
    var lookupDate2 = new Date();
    console.log('Lookup: ' + (lookupDate2 - lookupDate1) + ' ms' + body);
    bodyObj = JSON.parse(body);
    eeURL = bodyObj.url;
    eeAuth = bodyObj.auth;
    var url = require('url');
    var myURL = url.parse(eeURL);
    eeIP = myURL.hostname;
    console.log('eeURL set to ' + eeURL);
    console.log('eeIP set to ' + eeIP);
    console.log('eeAuth set to ' + eeAuth);
  }
});

// Instantiate the Leap controller
var controller = new Leap.Controller();

// Set up Leap controller callback
var moveDone = true;
var request = require('request');

controller.on('frame', function (frame) {
  if (frame.valid && frame.gestures.length > 0) {
    var frameDate1 = new Date();
    console.log(frame.id + ':' + frame.hands[0].palmPosition);

    var x = frame.hands[0].palmPosition[0];
    var y = frame.hands[0].palmPosition[1];
    var z = frame.hands[0].palmPosition[2];

    if (moveDone) { // Ignore incoming frames until the current arm movement is done
      moveDone = false;

      //console.log('OpenWhisk fluidURL: ' + eeURL);
      var openwhisk = require('openwhisk');
      var options = { ignore_certs: true, apihost: eeIP, api_key: eeAuth };
      const name = 'robotarm-dev-translate ';
      const blocking = true;
      const result = true;
      const params = { f: frame.id, x: x, y: y, z: z };
      var ow = openwhisk(options);

      var owDate1 = new Date();
      ow.actions.invoke( {name, blocking, result, params}).then(result => {
        var owDate2 = new Date();
        console.log('Fluid: ' + (owDate2 - owDate1) + ' ms' + JSON.stringify(result));

        var fluidSurl = config.fluidRobotURL + '/?x=' + result.coordinates.xAxis + '&y=' + result.coordinates.yAxis + '&z=' + result.coordinates.zAxis;
        console.log('Trying: ' + fluidSurl);
        var fluidPiDate1 = new Date();
        request(fluidSurl, function (error, response, body) {
          if (!error) {
            var fluidPiDate2 = new Date();
            console.log('Arm: ' + (fluidPiDate2 - fluidPiDate2) + ' ms ' + body);
            console.log('Total frame time:' + (fluidPiDate2 - frameDate1) + ' ms');
            moveDone = true;
          } else {
            console.log(error);
          }
        });

        moveDone = true;
      }).catch(err => {
        console.error('failed to invoke actions', err);
      });
    }

  } // end if (frame.valid)
});

controller.on('ready', function () {
    console.log('ready');
  });

controller.on('connect', function () {
    console.log('connect');
  });

controller.on('disconnect', function () {
    console.log('disconnect');
  });

controller.on('focus', function () {
    console.log('focus');
  });

controller.on('blur', function () {
    console.log('blur');
  });

controller.on('deviceConnected', function () {
    console.log('deviceConnected');
  });

controller.on('deviceDisconnected', function () {
    console.log('deviceDisconnected');
  });

controller.connect();
console.log('\nWaiting for device to connect...');
