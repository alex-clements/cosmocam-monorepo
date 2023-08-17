import { types as mediasoupTypes } from "mediasoup";
import { Socket } from "socket.io";
import { SendingSocket } from "./SendingSocket";
import { createLogger, loggingFiles } from "@cosmocam/shared";

const log = createLogger(
  !!loggingFiles.RECEIVING_SOCKET,
  "Receiving Socket File: "
);

export class ReceivingSocket {
  private id: string;
  private consumer: mediasoupTypes.Consumer | undefined;
  private consumerTransport: mediasoupTypes.WebRtcTransport | undefined;
  private socket: Socket | undefined;
  private sendingSocket: SendingSocket | undefined;
  private callback: any;

  constructor(socket: Socket) {
    this.id = socket.id;
    this.socket = socket;
  }

  public getId(): string {
    return this.id;
  }

  assignConsumer(producer: mediasoupTypes.Consumer) {
    this.consumer = producer;
  }

  assignConsumerTransport(producerTransport: mediasoupTypes.WebRtcTransport) {
    this.consumerTransport = producerTransport;
  }

  getConsumer() {
    return this.consumer;
  }

  getConsumerTransport() {
    return this.consumerTransport;
  }

  assignSocket(socket: Socket) {
    this.socket = socket;
  }

  assignToSendingSocket(sendingSocket: SendingSocket, callback: any) {
    this.callback = callback;
    this.removeFromSendingSocket();
    this.sendingSocket = sendingSocket;
    this.sendingSocket.addViewer(this);
  }

  public removeFromSendingSocket() {
    if (this.sendingSocket) {
      this.sendingSocket.removeViewer(this);
      this.sendingSocket = undefined;
    }
  }

  public destroy() {
    this.removeFromSendingSocket();
    this.consumer?.close();
    this.consumerTransport?.close();
    log("socket destroyed");
  }

  public producerIdReceived(producerId: string) {
    this.callback({ producerId });
  }

  public notifyNameChange(socketId: string, name: string) {
    this.socket?.emit("name-update", { socketId, name });
  }

  public notifySocketDisconnect(socketId: string) {
    this.socket?.emit("socket-disconnected", { socketId });
  }

  public notifyCameraAdded(socketId: string, name: string) {
    this.socket?.emit("camera-added", { socketId, name });
  }

  public restartStream() {
    this.socket?.emit("restart-stream");
  }
}
