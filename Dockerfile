FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y ffmpeg

RUN git clone https://github.com/phaticusthiccy/PrimonProto

RUN cd PrimonProto

RUN bash pri.sh