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
