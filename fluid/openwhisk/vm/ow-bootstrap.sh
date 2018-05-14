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
git clone https://github.com/apache/incubator-openwhisk.git openwhisk
