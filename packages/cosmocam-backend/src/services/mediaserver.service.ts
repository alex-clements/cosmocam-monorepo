import dotenv from "dotenv";

dotenv.config();

const getMediaServer = (data: any) => {
  let server_list = process.env.MEDIASERVER_IP_LIST?.split(",") || [];
  return server_list[0];
};

export const mediaserverService = { getMediaServer };
