// This tester script takes in four parameters in order:
//
// * URL for the robot arm server being tested
// * X coord to be tested (between -250 and 250)
// * Y coord to be tested (between 120 and 500)
// * Z coord to be tested (between 0 and -250)
//
// Keep in mind the Leap coordinate system:
// https://di4564baj7skl.cloudfront.net/documentation/images/Leap_Axes.png
//
// Example:
// node testarm.js http://192.168.1.112:8090 100 200 -200
//
// To reset the arm to it's default position, simply:
// node testarm.js

var myArgs = process.argv.slice(2);
console.log('args: ', myArgs);

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

var url = 'http://192.168.1.112:8090';
var x = 0;
var y = 120;
var z = 0;

if (myArgs.length > 0) {
  url = myArgs[0];
  x = myArgs[1];
  y = myArgs[2];
  z = myArgs[3];
}

var request = require('request');

var fluidSurl = url + '/?x=' + leap2armX(x) + '&y=' + leap2armY(y) + '&z=' + leap2armZ(z);
console.log('Trying: ' + fluidSurl);
var date1 = new Date();
request(fluidSurl, function (error, response, body) {
  if (!error) {
    var date2 = new Date();
    console.log('Arm: ' + (date2 - date1) + ' ms ' + body);
    lastDone = true;
    x = x + 10;
  } else {
    console.log(error);
  }
});
