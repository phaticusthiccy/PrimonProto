# Primon Proto 
# Headless WebSocket, type-safe Whatsapp UserBot
# 
# Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
# Multi-Device Lightweight ES5 Module (can usable with mjs)
#
# Phaticusthiccy - 2022


FROM ubuntu:latest

USER root

RUN apt-get update

RUN apt-get install -y git

ENV NODE_VERSION=16.13.0

RUN apt install -y curl

RUN apt-get install -y ffmpeg

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

ENV NVM_DIR=/root/.nvm

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}

RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}

RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

RUN git clone https://github.com/phaticusthiccy/PrimonProto

WORKDIR /PrimonProto

RUN npm install 

RUN yarn add github:adiwajshing/baileys

CMD [ "bash","pri.sh" ]