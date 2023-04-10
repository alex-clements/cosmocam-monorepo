import { Stream } from "./Stream";
import { Viewer } from "./Viewer";

export class User {
  private email: string;
  private streams: Stream[];
  private viewers: Viewer[];

  constructor(email: string) {
    this.email = email;
    this.streams = [];
    this.viewers = [];
  }

  getEmail(): string {
    return this.email;
  }

  addStream(stream: Stream) {
    this.streams.push(stream);
  }

  removeStream(stream: Stream) {
    let index = this.streams.findIndex((el) => el.getId() == stream.getId());
    this.streams.splice(index, 1);
  }

  addViewer(viewer: Viewer): void {
    this.viewers.push(viewer);
  }

  removeViewer(viewer: Viewer): void {
    let index = this.viewers.findIndex((el) => el.getId() === viewer.getId());
    this.viewers.splice(index, 1);
  }
}
