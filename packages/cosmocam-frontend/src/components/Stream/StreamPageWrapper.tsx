import { StreamPage } from "./StreamPage";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { registerSendingSocket } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

export const StreamPageWrapper = () => {
  const socket = useRef<Socket>();
  const { token } = useUserContext();
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("/mediasoup");

      socket.current.on("connection-success", ({ socketId }) => {
        registerSendingSocket({ token, socketId });
      });

      socket.current.on("viewer-added", () => {
        console.log("got a viewer!");
        // streaming.current = true;
        setStreaming(true);
      });

      socket.current.on("no-more-viewers", () => {
        console.log("no more viewers :(");
        // streaming.current = false;
        setStreaming(false);
      });
    }

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return <StreamPage socket={socket.current} streaming={streaming} />;
};
