FROM ubuntu:latest

USER root

RUN apt-get update

RUN apt-get -y install curl gnupg

RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -

RUN apt-get -y install nodejs

RUN git clone https://github.com/phaticusthiccy/PrimonProto

RUN npm install 

RUN cd PrimonProto

RUN bash pri.sh