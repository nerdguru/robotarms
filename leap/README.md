# Leap Controller
The Leap Controller is a simple Node.js command line program that loops, looking for frames from the Leap Motion Controller.  It derives from the [Leap Motion example](https://github.com/leapmotion/leapjs/blob/master/examples/node.js) and the [AWS Robot Arm demo](https://github.com/aws-samples/simplerobotservice/).

## Prerequisites
In order to run this demo, you will need the following:

* A Leap Motion Controller installed on your host machine
* At least one Raspberry Pi + Servo + SainSmart robot Arm
* A Function Router account configured as described in the `fluid/openwhisk` folder
* A deployed API as described in the `fixed` folder

## Installing
Be sure to have the latest version of Node.js, clone this repo, cd into this folder, and run:
```
node install
```
to install dependencies.

## Configuring
The behavior of the controller code is driven from a `config.json` file the controller looks for in the same folder it executes in.  A template is provided in `config-template.json` and the different entries in it change the actions of the controller as follows:

* **loggingOn** - `true` redirects stdout and stderr to a log file located in `logs`.  `false` causes stdout and stderr to display in the console that starts the controller.
* **fixedURL** - Should contain the string to the fixed URL that comes out of the deployment process described in `fixed`.
* **frURL** - Should contain the string of the Function Router instance being used to discover the fluid URL, most typically `https://api.functionrouter.com/lookup`.
* **serviceID** - Should contain the string found in the Function Router console for the service configured as part of the instructions in the `fluid/openwhisk` folder.
* **functionName** - Should contain the string identifying the function being used, most typically `get`.
* **latitude** - Should contain a decimal number for the latitude of the motion controller.
* **longitude** - Should contain a decimal number for the longitude of the motion controller.
* **accessToken** - Should contain the string found in the Function Router console for the client access token configured as part of the instructions in the `fluid/openwhisk` folder.

## Running
With a Leap Motion device installed, cd into the `controller` folder and simply run:
```
node controller.js
```
When logging to a file is turned on, the initial output will display the contents of the `config.json` file and where the log can be found:

```bash
{
  "loggingOn": true,
  "fixedURL": "https://XXXXXXXXX.execute-api.us-west-2.amazonaws.com/dev/robot",
  "frURL": "https://api.functionrouter.com/lookup",
  "serviceID": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "functionName": "get",
  "latitude": 44.9,
  "longitude": -85.7,
  "accessToken": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
Starting controller, details in: ../logs/2018-5-4-11-28.txt
```

Similarly, if file logging is turned off, the initial output will show the contents of the `config.json` file and the result of starting up the connection to the controller as well as performing the fluid URL lookup:
```bash
node controller.js
{
  "loggingOn": false,
  "fixedURL": "https://XXXXXXXXX.execute-api.us-west-2.amazonaws.com/dev/robot",
  "frURL": "https://api.functionrouter.com/lookup",
  "serviceID": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "functionName": "get",
  "latitude": 44.9,
  "longitude": -85.7,
  "accessToken": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
frURL: https://api.functionrouter.com/lookup
serviceID: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
functionName: get
latitude: 44.9
longitude: -85.7
accessToken: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
lookupURL: https://api.functionrouter.com/lookup/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/get?latitude=44.9&longitude=-85.7&accessToken=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
deviceConnected events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead
deviceDisconnected events are depricated.  Consider using 'streamingStarted/streamingStopped' or 'deviceStreaming/deviceStopped' instead

Waiting for device to connect...
connect
Optimized for desktop usage.
focus
ready
Lookup: 778 ms{"url":"https://XXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/robot/"}
eeURL set to https://XXXXXXXXX.execute-api.us-east-2.amazonaws.com/dev/robot/
```

## Troubleshooting
The Leap Motion daemon can be fragile at times, sometimes [requiring a restart](https://support.leapmotion.com/hc/en-us/articles/223784008-How-to-Manually-Restart-Leap-Core-Services) and others a full on reboot.
