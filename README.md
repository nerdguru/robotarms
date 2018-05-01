# Robot Arms
This repo houses code and instructions for the Robot Arms demo presented at Cisco Live in Orlando 2018.  It is an update to [a similar demo given on the keynote stage at AWS re:Invent 2016](https://github.com/aws-samples/simplerobotservice) but with the twist that business logic that translates the Leap Motion Controller readings into robot arm actions is housed in two locations.  One is in a traditional, hard-coded API endpoint in the public cloud but the second is a fluid API endpoint discovered with [Cisco's Function Router](http://functionrouter.com) that resolves to a VM running on a Cisco ISR4K sitting next to the Leap Motion Controller.  

The result is a visual representation of latency, as one set of motions causes two robot arms to respond but at different speeds.  The robot arm getting its instructions from the fixed public API endpoint will respond noticeably slower than its sibling, which receives its instructions from the VM on the ISR4K sitting next to it.  This demonstrates the power of serverless edge computing in situations where latency matters.

The fixed API scenario plays out visually as follows:

![Fixed API](/img/Fixed.jpg)

The code for the fixed API can be found in the `fixed` folder of this repo and consists of a simple Lambda function written with the [Serverless Framework](http://serverless.com).  Further instructions for setting up this aspect of the demo can be found in the subsequent folder.

The Leap Motion Controller code is located in the `leap` folder of this repo and it simply loops, reading in gestures as they occur. Further instructions for setting up this aspect of the demo can be found in the subsequent folder, but as gestures come in, it calls either the fixed API endpoint or the looks up the fluid API endpoint via Function Router, or both depending up on how its configuration file is set up.

The fluid API scenario plays out visually as follows:

![Fluid API](/img/Fluid.jpg)

In either case, the logic inside the functions for translating Leap gestures to robot arm instructions is exactly the same.  The only difference is where those functions execute.  In the fixed scenario, it is in a geographically distant public cloud data center.  In the fluid scenario, it is on an ISR4K located nearby.  The performance difference between the two robot arms is attributed to the latency between the two functions and shows how local edge compute can be taken advantage of as a serverless execution endpoint.

For more information on setup, please visit individual folders of this repo.
