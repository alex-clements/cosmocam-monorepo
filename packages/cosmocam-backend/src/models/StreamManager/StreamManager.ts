import { User } from "./User";

export class StreamManager {
  private users: Map<string, User>;
  constructor() {
    this.users = new Map<string, User>();
  }

  public getUser(user: string): User | undefined {
    if (this.users.has(user)) {
      return this.users.get(user);
    } else {
      return undefined;
    }
  }

  public addUser(user: User): void {
    this.users.set(user.getEmail(), user);
  }
}
