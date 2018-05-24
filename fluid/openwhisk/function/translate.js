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

function main(params) {
  // First, process parameters
  var f = params.f || 0;
  var x = params.x || 0;
  var y = params.y || 0;
  var z = params.z || 0;

  console.log(f + ' ' + x + ' ' + y + ' ' + z);

  // Next, translate the coordinates
  setX = leap2armX(x);
  setY = leap2armY(y);
  setZ = leap2armZ(z);
  console.log(setX + ' ' + setY + ' ' + setZ);

  // Finally, return the payload
  return { frameId: f, coordinates: { xAxis: setX, yAxis: setY, zAxis: setZ } };
}

exports.handler = main;
