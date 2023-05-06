import { SendingSocket } from "./SendingSocket";
import { ReceivingSocket } from "./ReceivingSocket";
import { types as mediasoupTypes } from "mediasoup";
import { createLogger } from "./util";
const mediasoup = require("mediasoup");

const LOGGING = false;
const log = createLogger(LOGGING);

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

  addSendingSocket(socketId: string) {
    const sendingSocket = new SendingSocket(socketId);
    this.sendingSockets.push(sendingSocket);
  }

  getSendingSocket(socketId: string) {
    return this.sendingSockets.find((el) => el.getId() === socketId);
  }

  addReceivingSocket(socketId: string): void {
    const receivingSocket = new ReceivingSocket(socketId);
    this.receivingSockets.push(receivingSocket);
  }

  getReceivingSocket(socketId: string) {
    return this.receivingSockets.find((el) => el.getId() === socketId);
  }

  removeSocket(socketId: string) {
    let index = this.sendingSockets.findIndex((el) => el.getId() === socketId);
    if (index > -1) {
      this.sendingSockets.splice(index, 1);
      log(`User.removeSocket removing sending socket at index ${index}`);
      return;
    }
    index = this.receivingSockets.findIndex((el) => el.getId() === socketId);
    this.receivingSockets.splice(index, 1);
    log(`User.removeSocket removing receiving socket at index: ${index}`);
    return;
  }

  getActiveStreams() {
    const activeStreams = [];

    for (let socket of this.sendingSockets) {
      if (socket.getProducer()?.id) {
        activeStreams.push(socket.getProducer()?.id);
      }
    }

    return activeStreams;
  }
}
