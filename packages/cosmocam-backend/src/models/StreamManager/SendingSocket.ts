import { types as mediasoupTypes } from "mediasoup";

export class SendingSocket {
  private id: string;
  private producer: mediasoupTypes.Producer | undefined;
  private producerTransport: mediasoupTypes.WebRtcTransport | undefined;

  constructor(id: string) {
    this.id = id;
  }

  assignProducer(producer: mediasoupTypes.Producer) {
    this.producer = producer;
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
}
