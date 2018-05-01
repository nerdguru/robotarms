# Fixed Public Cloud API
This folder contains the Serverless Framework project that forms the fixed public cloud API for the demo.

## Setup
First, [follow the setup instructions for the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/), then:
```bash
npm install
```
will load additional dependencies this project requires.

## Deploying

Simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (845 B)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............
Serverless: Stack update finished...
Service Information
service: robot
stage: dev
region: us-east-1
stack: robot-dev
api keys:
  None
endpoints:
  GET - https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/dev/robot/{f}/{x}/{y}/{z}/{c}
functions:
  get: robot-dev-get
  ```

  **TAKE NOTE OF THE ENDPOINT URL AS YOU WILL BE USING IT LATER WHEN CONFIGURING THE LEAP CONTROLLER.**

## Verifying the Deployment with CURL
Build a simple curl command:

```
curl https://XXXXXXXXX.execute-api.us-east-1.amazonaws.com/dev/robot/abc123/1.1/2/3/0
```
Example Result (prettified):
```json
{
  "frameId":"abc123",
  "coordinates":
  {
    "xAxis":200,
    "yAxis":374,
    "zAxis":625,
    "clockwiseness":"0"
  }
}
```
