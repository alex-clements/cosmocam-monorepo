import { appServerHost } from "../src/configs/appserver.config";

export const createURL = (api: string) => {
  return "http://" + appServerHost + api;
};
