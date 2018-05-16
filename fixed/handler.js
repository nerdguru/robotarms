module.exports.get = (event, context, callback) => {

  // See https://stackoverflow.com/questions/35190615/api-gateway-cors-no-access-control-allow-origin-header
  // API Gateway won't insert the 'Access-Control-Allow-Origin' but you can do it
  // Yourself manually here in the Lambda function
  f = event.pathParameters.f;
  x = event.pathParameters.x;
  y = event.pathParameters.y;
  z = event.pathParameters.z;
  c = event.pathParameters.c;
  console.log(f + ' ' + x + ' ' + y + ' ' + z + ' ' + c);

  setX = Math.round((600 - ((x / 1.98) * 450)) - 150);
  setY = Math.round(375 - (100 * (y / 360)));
  setZ = Math.round(275 + (((z + 50) / 200) * 200));
  console.log(setX + ' ' + setY + ' ' + setZ);

  // {'frameId':frame.id, 'coordinates':{'xAxis':set_xAxis,'yAxis':set_yAxis, 'zAxis': set_zAxis, 'clockwiseness': clockwiseness}}

  retval = {};
  retval.frameId = f;
  coords = {};
  coords.xAxis = setX;
  coords.yAxis = setY;
  coords.zAxis = setZ;
  coords.clockwiseness = c;
  retval.coordinates = coords;

  const response = {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(retval),
  };
  callback(null, response);
};
