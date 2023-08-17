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
  const [socketRegistered, setSocketRegistered] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("https://localhost:3002/mediasoup");

      socket.current.on("connection-success", ({ socketId }) => {
        registerSendingSocket({ token, socketId }).then(() => {
          setSocketRegistered(true);
        });
      });

      socket.current.on("viewer-added", () => {
        setStreaming(true);
      });

      socket.current.on("no-more-viewers", () => {
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
      {socket.current && socketRegistered && (
        <StreamPage socket={socket.current} streaming={streaming} />
      )}
    </>
  );
};
