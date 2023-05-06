import { types as mediasoupTypes } from "mediasoup";

export class ReceivingSocket {
  private id: string;
  private consumer: mediasoupTypes.Consumer | undefined;
  private consumerTransport: mediasoupTypes.WebRtcTransport | undefined;

  constructor(id: string) {
    this.id = id;
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
}
