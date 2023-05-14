import { StreamPage } from "./StreamPage";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { registerSendingSocket } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

export const StreamPageWrapper = () => {
  const socket = useRef<Socket>();
  const { token } = useUserContext();
  const [streaming, setStreaming] = useState(false);
  const [socketLoaded, setSocketLoaded] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("/mediasoup");

      socket.current.on("connection-success", ({ socketId }) => {
        registerSendingSocket({ token, socketId });
      });

      socket.current.on("viewer-added", () => {
        console.log("got a viewer!");
        setStreaming(true);
      });

      socket.current.on("no-more-viewers", () => {
        console.log("no more viewers :(");
        setStreaming(false);
      });

      setSocketLoaded(true);
    }

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return (
    <>
      {socket.current && (
        <StreamPage socket={socket.current} streaming={streaming} />
      )}
    </>
  );
};
