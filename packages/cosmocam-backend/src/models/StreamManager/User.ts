import { SendingSocket } from "./SendingSocket";
import { ReceivingSocket } from "./ReceivingSocket";
import { types as mediasoupTypes } from "mediasoup";
import { createLogger, loggingFiles } from "@cosmocam/shared";
import { Socket } from "socket.io";

const log = createLogger(!!loggingFiles.USER, "User File:");

export class User {
  private email: string;
  private sendingSockets: SendingSocket[];
  private receivingSockets: ReceivingSocket[];
  private router: mediasoupTypes.Router | undefined;

  constructor(email: string) {
    this.email = email;
    this.sendingSockets = [];
    this.receivingSockets = [];
  }

  assignRouter(router: mediasoupTypes.Router) {
    this.router = router;
  }

  getRouter(): mediasoupTypes.Router | undefined {
    return this.router;
  }

  getEmail(): string {
    return this.email;
  }

  addSendingSocket(socketId: string, socket: Socket) {
    const sendingSocket = new SendingSocket(socket);
    this.sendingSockets.push(sendingSocket);
  }

  getSendingSocket(socketId: string) {
    return this.sendingSockets.find((el) => el.getId() === socketId);
  }

  addReceivingSocket(socketId: string, socket: Socket): void {
    const receivingSocket = new ReceivingSocket(socket);
    this.receivingSockets.push(receivingSocket);
  }

  getReceivingSocket(socketId: string) {
    return this.receivingSockets.find((el) => el.getId() === socketId);
  }

  removeSocket(socketId: string) {
    let index = this.sendingSockets.findIndex((el) => el.getId() === socketId);
    if (index > -1) {
      this.removeSendingSocket(socketId, index);
      return;
    }
    index = this.receivingSockets.findIndex((el) => el.getId() === socketId);
    if (index > -1) {
      this.removeReceivingSocket(socketId, index);
    }
    return;
  }

  private removeSendingSocket(socketId: string, index: number) {
    const sendingSocket: SendingSocket = this.sendingSockets[index];
    sendingSocket.destroy();
    this.sendingSockets.splice(index, 1);
    log(`User.removeSocket removing sending socket at index ${index}`);
  }

  private removeReceivingSocket(socketId: string, index: number) {
    const receivingSocket: ReceivingSocket = this.receivingSockets[index];
    receivingSocket.destroy();
    this.receivingSockets.splice(index, 1);
    log(`User.removeSocket removing receiving socket at index: ${index}`);
  }

  getActiveStreams() {
    const producerIds = [];
    const socketIds = [];

    for (let socket of this.sendingSockets) {
      if (socket.getProducer()?.id) {
        producerIds.push(socket.getProducer()?.id);
      }
    }

    for (let socket of this.sendingSockets) {
      socketIds.push(socket.getId());
    }

    return { producerIds, socketIds };
  }
}
