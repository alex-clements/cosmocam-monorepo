import { types as mediasoupTypes } from "mediasoup";
import { Socket } from "socket.io";
import { ReceivingSocket } from "./ReceivingSocket";
import { createLogger, loggingFiles } from "@cosmocam/shared";
import { User } from "./User";

const log = createLogger(!!loggingFiles.SENDING_SOCKET, "SendingSocket File:");

export class SendingSocket {
  private id: string;
  private name: string;
  private user: User;
  private viewers: ReceivingSocket[];
  private socket: Socket | undefined;
  private producer: mediasoupTypes.Producer | undefined;
  private producerTransport: mediasoupTypes.WebRtcTransport | undefined;

  constructor(socket: Socket, user: User) {
    this.id = socket.id;
    this.socket = socket;
    this.name = socket.id;
    this.viewers = [];
    this.user = user;
    log(`socket ${this.id} created`);
  }

  public updateName(name: string) {
    this.name = name || this.id;
    this.user.notifyReceivingSocketsNameChange(this.id, this.name);
  }

  assignProducer(producer: mediasoupTypes.Producer) {
    this.producer = producer;
    for (let viewer of this.viewers) {
      viewer.producerIdReceived(this.producer.id);
    }
  }

  assignProducerTransport(producerTransport: mediasoupTypes.WebRtcTransport) {
    this.producerTransport = producerTransport;
  }

  getProducer() {
    return this.producer;
  }

  getProducerTransport() {
    return this.producerTransport;
  }

  public getId() {
    return this.id;
  }

  public assignSocket(socket: Socket) {
    this.socket = socket;
  }

  public addViewer(receivingSocket: ReceivingSocket) {
    log(`socket ${this.id} received a viewer`);
    if (this.viewers.length === 0) {
      log(`socket ${this.id} turned on`);
    }
    this.viewers.push(receivingSocket);
    if (this.viewers.length >= 1) {
      this.socket?.emit("viewer-added");
    }
    if (this.producer) {
      receivingSocket.producerIdReceived(this.producer.id);
    }
  }

  public removeViewer(receivingSocket: ReceivingSocket) {
    let index = this.viewers.findIndex(
      (el) => el.getId() === receivingSocket.getId()
    );
    this.viewers.splice(index, 1);
    if (this.viewers.length <= 0) {
      log(`socket ${this.id} turned off`);
      this.socket?.emit("no-more-viewers");
      this.producer?.close();
      this.producerTransport?.close();
      this.producer = undefined;
      this.producerTransport = undefined;
    }
  }

  public destroy() {
    this.viewers.forEach((receivingSocket) =>
      receivingSocket.removeFromSendingSocket()
    );
    this.producer?.close();
    this.producerTransport?.close();
    log(`socket ${this.id} destroyed`);
  }

  public getName() {
    return this.name;
  }
}
