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
  var logFileName = '../logs/' + d.toLocaleDateString().replace(/\//g, '-') +
                    '-' + currentTime + '.txt';

  console.log('Starting controller, details in: ' + logFileName);

  // Reroute console.log to the log file
  // Derived from https://stackoverflow.com/questions/32719923/redirecting-stdout-to-file-nodejs
  var log = fs.createWriteStream(logFileName, { flags: 'a' });
  process.stdout.write = process.stderr.write = log.write.bind(log);

}

// Perform Function Router lookup if needed
var eeURL = ''; // Execution endpoint URL
if (config.hasOwnProperty('frURL')) {
  // Need to perform lookup first
  console.log('frURL: ' + config.frURL);
  console.log('serviceID: ' + config.serviceID);
  console.log('functionName: ' + config.functionName);
  console.log('latitude: ' + config.latitude);
  console.log('longitude: ' + config.longitude);
  console.log('accessToken: ' + config.accessToken);
  var lookupURL = config.frURL + '/' +
                  config.serviceID + '/' +
                  config.functionName +
                  '?latitude=' + config.latitude + '&' +
                  'longitude=' + config.longitude + '&' +
                  'accessToken=' + config.accessToken;
  console.log('lookupURL: ' + lookupURL);

  var request = require('request');
  var date1 = new Date();
  request(lookupURL, function (error, response, body) {
    if (!error) {
      var date2 = new Date();
      console.log('Lookup: ' + (date2 - date1) + ' ms' + body);
      bodyObj = JSON.parse(body);
      eeURL = bodyObj.url;
      eeURL = config.cheatURL;
      console.log('eeURL set to ' + eeURL);
    }
  });
} else {
  console.log('No frURL, skipping Function Router logic');
}

// Instantiate the Leap controller
var controller = new Leap.Controller();
controller.on('frame', function (frame) {
  //console.log('Frame: ' + frame.id + ' @ ' + frame.timestamp);
});

// Set up Leap controller callback
var frameCount = 0;
controller.on('frame', function (frame) {
  frameCount++;
  if (frame.valid && frame.gestures.length > 0) {
    frame.gestures.forEach(function (gesture) {

      // Build the fixed API call URL
      console.log(frame.id + ':' + frame.hands[0].palmPosition);
      var frameID = frame.id;
      var x = frame.hands[0].palmPosition[0];
      var y = frame.hands[0].palmPosition[1];
      var z = frame.hands[0].palmPosition[2];
      var c = 0;

      // If a Fixed URL is present, continue
      if (config.hasOwnProperty('fixedURL')) {
        var fullFixedURL = config.fixedURL + '/' + frameID + '/' + x +
                    '/' + y + '/' + z + '/' + c;
        console.log('fixedURL: ' + fullFixedURL);

        // Make the fixed API call
        var request = require('request');
        var date1 = new Date();
        request(fullFixedURL, function (error, response, body) {
          if (!error) {
            var date2 = new Date();
            console.log('Fixed: ' + (date2 - date1) + ' ms' + body);
          } else {
            console.log(error);
          }
        });
      } else {
        console.log('No fixedURL, skipping fixed logic');
      }

      // If a Execution Endpoint URL is present, continue
      if (eeURL != '') {
        var fluidURL = eeURL + '/' + frameID + '/' + x +
                    '/' + y + '/' + z + '/' + c;
        console.log('fluidURL: ' + fullFixedURL);

        // Make the fluid API call
        var request = require('request');
        var date1 = new Date();
        request(fluidURL, function (error, response, body) {
          if (!error) {
            var date2 = new Date();
            console.log('Fluid: ' + (date2 - date1) + ' ms' + body);
          } else {
            console.log(error);
          }
        });
      } else {
        console.log('No eeURL, skipping Function Router logic');
      }

    }); // end frame.gestures.forEach
  } // end if (frame.valid)
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
