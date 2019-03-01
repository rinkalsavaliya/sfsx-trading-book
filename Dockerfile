FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install --yes build-essential libssl-dev
RUN apt-get install --yes curl
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 8.12.0
ENV NODE_ENV production

RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.30.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV HOME /home

RUN apt-get -y update
RUN apt-get install --yes npm
RUN npm install -g pm2 typescript

RUN mkdir /trading-book
RUN mkdir /trading-book/backend
RUN mkdir /trading-book/frontend

WORKDIR /trading-book/backend
COPY backend/package.json /trading-book/backend
RUN npm install

WORKDIR /trading-book/frontend
COPY frontend/package.json /trading-book/frontend
RUN npm install

WORKDIR /trading-book
COPY . /trading-book

WORKDIR /trading-book/frontend
RUN npm run build

WORKDIR /trading-book/backend
RUN npm run build

EXPOSE 3000
CMD pm2-docker dist/index.js
