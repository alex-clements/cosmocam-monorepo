import { appServerHost } from "../src/configs/appserver.config";

export const createURL = (api: string) => {
  return "https://" + appServerHost + api;
};
