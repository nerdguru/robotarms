# Leap Controller
The Leap Controller is a simple Node.js command line program that loops, looking for frames from the Leap Motion Controller.  It derives from the [Leap Motion example](https://github.com/leapmotion/leapjs/blob/master/examples/node.js) and the [AWS Robot Arm demo](https://github.com/aws-samples/simplerobotservice/blob/master/device/src/publisher.py).

## Installing
Be sure to have the latest version of Node.js, clone this repo, cd into this folder, and run:
```
node install
```
to install dependencies.

## Running
With a Leap Motion device installed, cd into the `controller` folder and simply run:
```
node controller.js
```

## Troubleshooting
The Leap Motion daemon can be fragile at times, sometimes [requiring a restart](https://support.leapmotion.com/hc/en-us/articles/223784008-How-to-Manually-Restart-Leap-Core-Services) and others a full on reboot.
