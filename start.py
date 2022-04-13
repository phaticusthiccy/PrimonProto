#!/usr/bin/python
#-*- conding: utf-8 -*-

from asyncio import sleep
from webwhatsapi import WhatsAPIDriver

def primonproto(Client):
    try:
        print('Connecting..')
        Client.get_qr()
        print('Successfuly Started ✅')
        return True
    except:
        print('Unsuccessful Attempt ❌')
        Client.close()
        primonproto()

def message(client):
    msg = client.get_messages(include_me=True)
    return msg


if __name__ == '__main__':
    driver = WhatsAPIDriver(username="PrimonProto")
    connect = primonproto(driver)
    while connect is True:
        msg = message(driver)
        print(msg)
