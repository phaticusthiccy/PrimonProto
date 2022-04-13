#!/usr/bin/python
#-*- conding: utf-8 -*-

import logging
from asyncio import sleep
from models import Chat
from decouple import config
from models import Message
from webwhatsapi import WhatsAPIDriver
from webwhatsapi.objects.message import MMSMessage, MediaMessage

logging.basicConfig(level=logging.ERROR)


def primonproto():
    try:
        print('Connecting..')
        driver.wait_for_login()
        print('Successfuly Started ✅')
        return True
    except BaseException as e:
        if e == 'Unsuccessful Attempt ❌':
            driver.close()
            primonproto()


def all_chat_id(driver):
    try:
        chat = driver.get_all_chat_ids()
        return chat
    except BaseException as e:
        print(e)
        return False

def unread_messages(driver):
    for contact in driver.get_unread():
        if contact is None:
            unread_messages()
        return contact

def message_on_ack(unread):
    for msg in unread.messages:
        if msg.type not in ['call_log', 'e2e_notification', 'gp2']:
            msg_type = msg.type,
            chat_id = msg.chat_id['_serialized']
            chat = driver.get_chat_from_id(chat_id)
            chat_obj = chat.get_js_obj()
            chat_name = chat_obj.get('name')
            save_chat(chat_name)
            if msg_type == 'image':
                msg_content = 'IMG',
            elif isinstance(msg, MMSMessage):
                msg_content = 'MMSMessage'
            elif isinstance(msg, MediaMessage):
                msg_content = 'MediaMessage'
            elif isinstance(msg, Message):
                msg_content = msg.safe_content
            else:
                try:
                    msg_content = msg.content
                except AttributeError:
                    msg_content = None
            message = {
                'msg_id': msg.id,
                'msg_type': msg.type,
                'msg_chat_id': chat_id,
                'chat_name': chat_name,
                'msg_sender_id': msg.sender.id,
                'msg_sender': msg.sender.name,
                'msg_date': msg.timestamp,
                'msg': msg_content,
            }
            return message
        return None


if __name__ == '__main__':
    driver = WhatsAPIDriver(loadstyles=True)
    connect = primonproto()
    while connect is True:
        unread = unread_messages(driver)
        if unread is not None:
            message = message_on_ack(unread)
            if message is not None:
                print(message)
            continue
        continue
