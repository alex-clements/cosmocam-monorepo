export const createLogger = (loggingEnabled: boolean) => {
  return function (...args: any[]) {
    if (loggingEnabled) {
      console.log(...args);
    }
  };
};
