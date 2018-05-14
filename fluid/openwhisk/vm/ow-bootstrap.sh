#!/bin/bash
# This script will bootstrap an OpenWhisk installation
#

##############################################
# First, separately install the latest Docker
##############################################

# We're gonna need Git
sudo add-apt-repository ppa:git-core/ppa
sudo apt-get update -y
sudo apt-get install git -y


# Install Docker per https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce-1
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce -y
sudo docker run hello-world


##############################################
# Next, get OpenWhisk and prep
##############################################

# Get openwhisk from trunk
sudo git clone https://github.com/apache/incubator-openwhisk.git openwhisk

# Replace the all.sh and execute it
sudo cp all-less-docker.sh all.sh
sudo mv all.sh openwhisk/tools/ubuntu-setup/all.sh

cd openwhisk/tools/ubuntu-setup
sudo ./all.sh

# Perform ansible pre build steps
cd
cd openwhisk/ansible
sudo ansible-playbook setup.yml
sudo ansible-playbook prereq.yml
sudo ansible-playbook couchdb.yml --tags ini

####################################
# Build OpenWhisk and start services
####################################

# Build OpenWhisk
cd
cd openwhisk
sudo ./gradlew distDocker

# Start services
cd ansible
sudo ansible-playbook couchdb.yml
sudo ansible-playbook initdb.yml
sudo ansible-playbook wipe.yml
sudo ansible-playbook apigateway.yml
sudo ansible-playbook openwhisk.yml
sudo ansible-playbook postdeploy.yml

###################
# Configure the CLI
###################
cd
cd openwhisk
./bin/wsk property set --apihost 127.0.0.1
./bin/wsk property set --auth `cat ansible/files/auth.guest`
./bin/wsk action invoke /whisk.system/utils/echo -p message hello --result --insecure

