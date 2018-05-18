# Setting up OpenWhisk on a VM
A script is provided to bootstrap your OpenWhisk install.  At the Ubuntu prompt:

```
wget https://raw.githubusercontent.com/nerdguru/robotarms/master/fluid/openwhisk/vm/ow-bootstrap.sh
sudo chmod +x ow-bootstrap.sh
wget https://raw.githubusercontent.com/nerdguru/robotarms/master/fluid/openwhisk/vm/all-less-docker.sh
sudo chmod +x all-less-docker.sh
sudo ./ow-bootstrap.sh
```
The `ow-bootsrtap.sh` first installs `git` and the latest Docker before replacing the `all.sh` so that an older Docker does not get installed.  It then builds OpenWhisk and ultimately configures the `wsk` CLI to talk to `127.0.0.1`.  To get the CLI to talk to an external, public IP, simply:

```
./bin/wsk property set --apihost <public IP>
```

The resulting connectivity information will be stored in `~/.wskprops`

When done, the result should be:

```
ok: whisk API host set to 127.0.0.1
ok: whisk auth set. Run 'wsk property get --auth' to see the new value.
{
    "message": "hello"
}
```

# Registering Your OpenWhisk Execution Endpoint  and Location with Funtion Router
Here, you will first register the location of your Execution Endpoint created in the previous step and register its Endpoint with the Function Router console.

## Register your OpenWhisk Location
Login to the Function Router Console and on the left menu, select "Location", and then press "Create".  The resulting screen should look like this:

![Create Location Screen](location.jpg)

There, enter the name, longitude, and latitude of the location of your Execution Endpoint and press "Save".  Note that the latitude and longitude do not have to be as precise for this example application as they would for a production use case, so best guess is fine for now.

## Register your OpenWhisk Execution Endpoint
With the location of the Execution Endpoint entered, next, on the left menu, select "Execution Endpoints", and then press "Create".   The resulting screen should look like this:

![Register Execution Endpoint](executionendpoint.jpg)

There, enter the name you would like to use for the Execution Endpoint and select dropdowns for the location you just entered and the OpenWhisk runtime as appropriate.

In the last three text boxes, enter the following:

* **AWS Access Key / OpenWhis API Host** - Enter the public IP address of your Execution Endpoint.
* **AWS Secret / OpenWhisk username:pass** - Enter the OpenWhisk auth key noted during your Execution Endpoint deployment.  By default, this value is `23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP`.
* **OpenWhisk Namespace** - Enter the OpenWhisk namespace noted during your Execution Endpoint deployment.  By default, this value is `guest`.

When done, press "Save".

From the resulting list screen, take note of the ID of the service just created as it will be used when configuring the Leap Controller.
