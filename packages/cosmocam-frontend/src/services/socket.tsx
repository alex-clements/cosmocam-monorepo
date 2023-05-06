import axios from "axios";
import { apis } from "@cosmocam/shared";

export const registerSendingSocket = async ({ token, socketId }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  return axios.post(
    apis.REGISTER_SENDING_SOCKET,
    { socketId },
    { headers: headers }
  );
};

export const registerReceivingSocket = async ({ token, socketId }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  return axios.post(
    apis.REGISTER_RECEIVING_SOCKET,
    { socketId },
    { headers: headers }
  );
};

export const fetchActiveStreams = async ({ token }: { token: string }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };

  return axios.get(apis.GET_ACTIVE_STREAMS, { headers });
};
