import { User } from "./User";

export class StreamManager {
  private users: Map<string, User>;
  private socketMap: Map<string, User>;
  constructor() {
    this.users = new Map<string, User>();
    this.socketMap = new Map<string, User>();
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
    if (user) {
      user.addSendingSocket(socketId);
      this.socketMap.set(socketId, user);
    }
    console.log("registerSendingSocket");
  }

  public removeSocket(socketId: string) {
    if (this.socketMap.has(socketId)) {
      const user = this.socketMap.get(socketId);
      user?.removeSocket(socketId);
      this.socketMap.delete(socketId);
    }
  }

  public registerReceivingSocket(userEmail: string, socketId: string) {
    this.addUser(userEmail);
    const user = this.users.get(userEmail);
    if (user) {
      user.addReceivingSocket(socketId);
      this.socketMap.set(socketId, user);
    }
    console.log("registerReceivingSocket");
  }

  public getUserBySocketId(socketId: string): User | undefined {
    return this.socketMap.get(socketId);
  }
}
