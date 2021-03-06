// Primon Proto
// Headless WebSocket, type-safe Whatsapp Bot
//
// Primon, lisanced under GNU GENERAL PUBLIC LICENSE. May cause some warranity problems, within Priomon.
// Multi-Device Lightweight ES6 Module (can usable with mjs)
//
// Phaticusthiccy - 2022


import { proto } from "@adiwajshing/baileys";

export class MessageRetryHandler {
  public messagesMap: Record<string, proto.IMessage>;

  constructor() {
    this.messagesMap = {};
  }

  addMessage = async (message: proto.IWebMessageInfo) => {
    const id = message.key.id ?? "";
    this.messagesMap[id] = this.cleanMessage(message);
    return message;
  };

  getMessage = (msgKey: string): proto.IMessage => {
    return this.messagesMap[msgKey];
  };

  removeMessage = (msgKey: string) => {
    delete this.messagesMap[msgKey];
  };

  getMessageKeys = (): string[] => {
    return Object.keys(this.messagesMap);
  };

  cleanMessage = (message: proto.IWebMessageInfo): proto.IMessage => {
    const msg = message.message ?? {};
    return msg;
  };

  messageRetryHandler = async (message: proto.IMessageKey) => {
    const msg = this.getMessage(message.id ?? "");
    this.removeMessage(message.id ?? "");
    return msg;
  };
}