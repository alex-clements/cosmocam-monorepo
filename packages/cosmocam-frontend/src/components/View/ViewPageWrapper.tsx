import { useEffect } from "react";
import { useUserContext } from "../Context/Providers";
import { ViewPage } from "./ViewPage";
import { io, Socket } from "socket.io-client";
import { registerReceivingSocket } from "../../services/socket";

export const ViewPageWrapper = () => {
  const socket: Socket = io("/mediasoup");
  const { token } = useUserContext();

  useEffect(() => {
    socket.on("connection-success", ({ socketId, existsProducer }) => {
      console.log(socketId, existsProducer);
      registerReceivingSocket({ token, socketId });
    });
  }, []);

  return <ViewPage socket={socket} />;
};
