export const createLogger = (loggingOn: boolean) => {
  return (...args: any[]) => {
    if (loggingOn) {
      console.log(...args);
    }
  };
};
