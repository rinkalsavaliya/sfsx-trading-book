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

in the UI, you can see a form to add a trade, where you've to select ticker, fill the trader name, order price, number of Shares and select order side (buy/sell).
in **resting buy trades** and **resting sell trades**, you can see **ALL** trades, which are rested in the book.

in *resting buy trades*, you'll the orders in **descending** order of the *price* of each trade,

whereas, in *resting sell trades*, you'll the orders in **ascending** order of the *price* of each trade.

In **Trading Log** section, you'll see the executed trades, once they get executed.


## Deployment
install docker in your machine

build the docker image

> docker build . -t sfsx

run the image

> docker run -d -p 3000:3000 --name sfsx sfsx
