function main(params) {
  // First, process parameters
  var f = params.f || 0;
  var x = params.x || 0;
  var y = params.y || 0;
  var z = params.z || 0;
  var c = params.c || 0;
  console.log(f + ' ' + x + ' ' + y + ' ' + z + ' ' + c);

  // Next, translate the coordinates
  setX = Math.round((600 - ((x / 1.98) * 450)) - 150);
  setY = Math.round(375 - (100 * (y / 360)));
  setZ = Math.round(275 + (((z + 50) / 200) * 200));
  console.log(setX + ' ' + setY + ' ' + setZ);

  // Finally, return the payload
  retval = {};
  retval.frameId = f;
  coords = {};
  coords.xAxis = setX;
  coords.yAxis = setY;
  coords.zAxis = setZ;
  coords.clockwiseness = c;
  retval.coordinates = coords;
  return { payload: JSON.stringify(retval) };
}

exports.handler = main;