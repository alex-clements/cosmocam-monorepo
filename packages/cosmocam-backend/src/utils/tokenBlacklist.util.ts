export class TokenBlacklist {
  private static instance: TokenBlacklist;
  private map = new Map();

  static getInstance() {
    if (!TokenBlacklist.instance) {
      TokenBlacklist.instance = new TokenBlacklist();
    }
    return TokenBlacklist.instance;
  }

  addToken(token: string) {
    this.map.set(token, "");
  }

  hasToken(token: string): boolean {
    return this.map.has(token);
  }
}
