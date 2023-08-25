import { StreamPage } from "./StreamPage";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { registerSendingSocket } from "../../services/socket";
import { useUserContext } from "../Context/Providers";
import { fetchUserMediaServer } from "../../services/mediaserver";
import { CircularProgress, Container } from "@mui/material";

export const StreamPageWrapper = () => {
  const socket = useRef<Socket>();
  const { token } = useUserContext();
  const [streaming, setStreaming] = useState(false);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [socketRegistered, setSocketRegistered] = useState(false);

  useEffect(() => {
    setupSocket();
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const setupSocket = async () => {
    if (!socket.current) {
      let val = await fetchUserMediaServer({ token });
      let mediaServerUrl = val.data;
      socket.current = io("https://" + mediaServerUrl + "/mediasoup");

      socket.current.on("connection-success", ({ socketId }) => {
        registerSendingSocket({ token, socketId, mediaServerUrl }).then(() => {
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
  };

  return (
    <>
      {socket.current && socketRegistered ? (
        <StreamPage socket={socket.current} streaming={streaming} />
      ) : (
        <Container sx={{ paddingY: 5 }}>
          <CircularProgress />
        </Container>
      )}
    </>
  );
};
