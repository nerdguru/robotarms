#!/usr/bin/node

// This version of the controller does not involve the external API calls
// in oder to translate Leap coords to robot arm coords.  At startup, it
// will grab the 'fluidRobotURL' out of config.json and loop over Leap
// frames.  As a frame comes in, it will call the Pi server named in
// 'fluidRobotURL' and ignore other frames while that Pi call is handled
//
// For testing purposes, this should be the fastest interaction between
// the Leap and the arm

require('../template/entry');
var fs = require('fs');

// Z coordinates (upper arm) on the Leap go from a min of
// zero (directly over the Leap) and a max of -250 (behind it ~25cm)
// This function maps that to the robot arm from proximal most (2000)
// to distalmost (1100)
function leap2armZ(z) {
  var distalmost = 1100;
  var proximalmost = 2000;

  // Priximalmost corner case
  if (z >= 0) {
    return proximalmost;
  }

  // Distalmost corner case
  if (z <= -250) {
    return distalmost;
  }

  // Every other case
  var r = z / -250;
  rs = r * 900;
  return Math.round(proximalmost - rs);

}

// Y coordinates (lower arm) on the Leap go from a min of
// 120 (directly over the Leap by ~12 cm) and a max of 500 (above it ~50cm)
// This function maps that to the robot arm from proximal most (1600)
// to distalmost (1000)
function leap2armY(y) {
  var distalmost = 1000;
  var proximalmost = 1600;

  // Priximalmost corner case
  if (y <= 120) {
    return proximalmost;
  }

  // Distalmost corner case
  if (y >= 500) {
    return distalmost;
  }

  // Every other case
  var r = (y - 120) / 320;
  rs = r * 600;
  return Math.round(proximalmost - rs);

}

// X coordinates (shoulder) on the Leap go from a min of
// -250 (~25 cm to the left) and a max of 250 (to the right ~25cm)
// This function maps that to the robot arm from left most (2500)
// to rightmost (650)
function leap2armX(x) {
  var leftmost = 2500;
  var rightmost = 650;
  var center = 1575;

  // Leftmost corner case
  if (x <= -250) {
    return leftmost;
  }

  // Between leftmost and center case
  if (x > -250 && x < 0) {
    var r = x / -250; // Percentage to left of center
    var rs = r * 925; // 925 = amount of space between leftmost and center
    return Math.round(1575 + rs);
  }

  // Center case
  if (x == 0)
    return center;

  // Between center and rightmost case
  if (x > 0 && x < 250) {
    var r = x / 250; // Percentage right of center
    var rs = r * 925; // 925 = amount of spce between center and rightmost
    return Math.round(1575 - rs);
  }

  // Rightmost corner case
  if (x >= 250) {
    return rightmost;
  }
}

// Load up the config file
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
console.log(JSON.stringify(config, undefined, 2));
var url = config.fluidRobotURL;

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
      var fluidSurl = url + '/?x=' + leap2armX(x) + '&y=' + leap2armY(y) + '&z=' + leap2armZ(z);
      console.log('Trying: ' + fluidSurl);
      var date1 = new Date();
      request(fluidSurl, function (error, response, body) {
        if (!error) {
          var date2 = new Date();
          console.log('Arm: ' + (date2 - date1) + ' ms ' + body);
          console.log('Total frame time:' + (date2 - frameDate1) + ' ms');
          moveDone = true;
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
