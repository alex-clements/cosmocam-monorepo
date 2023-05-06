import { StreamPage } from "./StreamPage";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";
import { registerSendingSocket } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

export const StreamPageWrapper = () => {
  const socket: Socket = io("/mediasoup");
  const { token } = useUserContext();

  useEffect(() => {
    socket.on("connection-success", ({ socketId }) => {
      registerSendingSocket({ token, socketId });
    });
  }, []);

  return <StreamPage socket={socket} />;
};
