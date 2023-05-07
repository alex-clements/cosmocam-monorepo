export const createLogger = (loggingEnabled: boolean, prefix?: string) => {
  return function (...args: any[]) {
    if (loggingEnabled) {
      if (prefix) {
        console.log("\x1b[34m%s\x1b[0m", prefix, " ", ...args);
      } else {
        console.log(...args);
      }
    }
  };
};
