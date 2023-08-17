import axios from "axios";
import { apis } from "@cosmocam/shared";

export const registerSendingSocket = async ({ token, socketId }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  let url = "https://localhost:3002" + apis.REGISTER_SENDING_SOCKET;

  return axios.post(url, { socketId }, { headers: headers });
};

export const registerReceivingSocket = async ({ token, socketId }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  let url = "https://localhost:3002" + apis.REGISTER_RECEIVING_SOCKET;
  return axios.post(url, { socketId }, { headers: headers });
};

export const fetchActiveStreams = async ({ token }: { token: string }) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  let url = "https://localhost:3002" + apis.GET_ACTIVE_STREAMS;

  return axios.get(url, { headers });
};
