import { User } from "./User";
import { createLogger } from "@cosmocam/shared";
import { Socket } from "socket.io";

const loggingEnabled = false;
const log = createLogger(loggingEnabled, "Stream Manager File:");

export class StreamManager {
  private users: Map<string, User>;
  private socketUserMap: Map<string, User>;
  private socketMap: Map<string, Socket>;

  constructor() {
    this.users = new Map<string, User>();
    this.socketUserMap = new Map<string, User>();
    this.socketMap = new Map<string, Socket>();
  }

  public getUser(user: string): User | undefined {
    if (this.users.has(user)) {
      return this.users.get(user);
    } else {
      return undefined;
    }
  }

  public addUser(user: string) {
    if (!this.users.has(user)) {
      this.users.set(user, new User(user));
    }
  }

  public registerSendingSocket(userEmail: string, socketId: string) {
    this.addUser(userEmail);
    const user = this.users.get(userEmail);
    const socket = this.socketMap.get(socketId);
    if (user && socket) {
      user.addSendingSocket(socketId, socket);
      this.socketUserMap.set(socketId, user);
    }
    log("registerSendingSocket");
  }

  public removeSocket(socketId: string) {
    if (this.socketUserMap.has(socketId)) {
      const user = this.socketUserMap.get(socketId);
      user?.removeSocket(socketId);
      this.socketUserMap.delete(socketId);
    }
  }

  public registerReceivingSocket(userEmail: string, socketId: string) {
    this.addUser(userEmail);
    const user = this.users.get(userEmail);
    const socket = this.socketMap.get(socketId);
    if (user && socket) {
      user.addReceivingSocket(socketId, socket);
      this.socketUserMap.set(socketId, user);
    }
    log("registerReceivingSocket");
  }

  public getUserBySocketId(socketId: string): User | undefined {
    return this.socketUserMap.get(socketId);
  }

  public registerSocket(socket: Socket) {
    this.socketMap.set(socket.id, socket);
  }
}
