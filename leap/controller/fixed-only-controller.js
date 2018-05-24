#!/usr/bin/node

// This version of the controller uses the fixed URL only.  At startup, it
// will grab the 'fixedURL' and 'fixedRobotURL' out of config.json and loop over
// Leap frames.  As a frame comes in, it will call the 'fixedRobotURL' with the
// Leap coordinates and get back coordinates for the robot arm, which it then
// passes onto Pi referenced in 'fixedRobotURL'.  It ignores frames that come
// in while this processing is happening.

require('../template/entry');
var fs = require('fs');

// Load up the config file
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
console.log(JSON.stringify(config, undefined, 2));
var url = config.fixedRobotURL;

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

      var fullFixedURL = config.fixedURL + '/' + frame.id + '/' + x + '/' + y + '/' + z;
      console.log('fixedURL: ' + fullFixedURL);

      // Make the fixed API call
      var request = require('request');
      var apiDate1 = new Date();
      request(fullFixedURL, function (error, response, body) {
        if (!error) {
          var apiDate2 = new Date();

          console.log('Fixed: ' + (apiDate2 - apiDate1) + ' ms' + body);
          var bodyJ = JSON.parse(body);

          var fixedSurl = url + '/?x=' + bodyJ.coordinates.xAxis + '&y=' + bodyJ.coordinates.yAxis + '&z=' + bodyJ.coordinates.zAxis;
          console.log('Trying: ' + fixedSurl);
          var piDate1 = new Date();
          request(fixedSurl, function (error, response, body) {
            if (!error) {
              var piDate2 = new Date();
              console.log('Arm: ' + (piDate2 - piDate1) + ' ms ' + body);
              console.log('Total frame time:' + (piDate2 - frameDate1) + ' ms');
              moveDone = true;
            } else {
              console.log(error);
            }
          });
        } else {
          console.log(error);
        }
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
