FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y ffmpeg
RUN apt-get install -y git
RUN apt-get install -y node

RUN git clone https://github.com/phaticusthiccy/PrimonProto
RUN npm install 

RUN cd PrimonProto

RUN bash pri.sh