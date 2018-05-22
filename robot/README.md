# Robot
This folder contains a very simple `server.js` file that can be used on the Raspberry Pi to drive the behavior of the robot arm.  

To install the server (assuming you already have NPM and Node.js), simply enter:

```
wget https://raw.githubusercontent.com/nerdguru/robotarms/master/robot/server.js
npm install adafruit-pca9685
node server.js
```
It creates an HTTP server that listens to port `8090` and takes in parameters in the query string like so:

```bash
http://<your IP>:8090/?x=650&y=1000&z=2000
```

where:

* X - Controls the shoulder motor.  -90 degrees = 2500, +90 degrees = 650, straight = 1575
* Y - Controls the lower arm motor.  Most proximal to the base = 1600, most distal to the base = 1000
* Z - Controls the upper arm motor.  Most proximal to the base = 2000, most distal to the base = 1100
