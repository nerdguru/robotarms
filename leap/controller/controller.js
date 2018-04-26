#!/usr/bin/node
require('../template/entry');
var fs = require('fs');

// Load up the config file
var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
console.log(JSON.stringify(config, undefined, 2));

if (config.loggingOn) {
  // Pipe output to a log file
  // Build logfile name
  d = new Date();
  var currentTime = d.toLocaleTimeString().replace(/:/g, '-');
  currentTime = currentTime.substring(0, currentTime.length - 3);
  var logFileName = '../logs/' + d.toLocaleDateString().replace(/\//g, '-')
                    + '-' + currentTime + '.txt';

  console.log('Starting controller, details in: ' + logFileName);

  // Reroute console.log to the log file
  // Derived from https://stackoverflow.com/questions/32719923/redirecting-stdout-to-file-nodejs
  var log = fs.createWriteStream(logFileName, { flags: 'a' });
  process.stdout.write = process.stderr.write = log.write.bind(log);

}

var controller = new Leap.Controller();
controller.on('frame', function (frame) {
  //console.log('Frame: ' + frame.id + ' @ ' + frame.timestamp);
});

var frameCount = 0;
controller.on('frame', function (frame) {
  frameCount++;
  if (frame.valid && frame.gestures.length > 0) {
    frame.gestures.forEach(function (gesture) {
      console.log(frame.hands[0].palmPosition);

      // API call to go here

    }); // end frame.gestures.forEach

  } // end if (frame.valid
});

setInterval(function () {
  var time = frameCount / 2;
  frameCount = 0;
}, 2000);

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
