# Setting up OpenWhisk on a VM
A script is provided to bootstrap your OpenWhisk install.  At the Ubuntu prompt:

```
wget https://raw.githubusercontent.com/nerdguru/robotarms/master/fluid/openwhisk/vm/ow-bootstrap.sh
sudo chmod +x ow-bootstrap.sh
wget https://raw.githubusercontent.com/nerdguru/robotarms/master/fluid/openwhisk/vm/all-less-docker.sh
sudo chmod +x all-less-docker.sh
sudo ./ow-bootstrap.sh
```
The `ow-bootsrtap.sh` first installs `git` and the latest Docker before replacing the `all.sh` so that an older Docker does not get installed.  It then builds OpenWhisk and ultimately configures the `wsk` CLI.
