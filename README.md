# SFSX Trading book visualization

> Author: Rinkal Savaliya (rinkal@scaletech.xyz)

this repository contains a POC for SFSX Trading Book visualization

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Install Node JS in your machine.

*please use node >= 8*

Install dependencies and Start the application
go to the `frontend` folder

After you have installed Node JS, run `npm install`

To start the application, run `npm start`

### Project modules
please check code comments inside the modules and components.

the structure is self explanatory.


## Deployment
install docker in your machine

build the docker image

> docker build . -t sfsx

run the image

> docker run -d -p 3000:3000 --name sfsx sfsx
