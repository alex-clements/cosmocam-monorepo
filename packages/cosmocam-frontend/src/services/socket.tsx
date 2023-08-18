import axios from "axios";
import { apis } from "@cosmocam/shared";

export const registerSendingSocket = async ({
  token,
  socketId,
  mediaServerUrl,
}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  let url = "https://" + mediaServerUrl + apis.REGISTER_SENDING_SOCKET;

  return axios.post(url, { socketId }, { headers: headers });
};

export const registerReceivingSocket = async ({
  token,
  socketId,
  mediaServerUrl,
}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  let url = "https://" + mediaServerUrl + apis.REGISTER_RECEIVING_SOCKET;
  return axios.post(url, { socketId }, { headers: headers });
};

export const fetchActiveStreams = async ({
  token,
  mediaServerUrl,
}: {
  token: string;
  mediaServerUrl: string;
}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
  let url = "https://" + mediaServerUrl + apis.GET_ACTIVE_STREAMS;
  return axios.get(url, { headers });
};
