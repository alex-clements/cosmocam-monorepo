import { Fragment, useEffect, useRef, useState } from "react";
import { useUserContext } from "../Context/Providers";
import { ViewPage } from "./ViewPage";
import { io, Socket } from "socket.io-client";
import { registerReceivingSocket } from "../../services/socket";

export const ViewPageWrapper = () => {
  const [socketSet, setSocketSet] = useState(false);
  const socket = useRef<Socket>();
  const { token } = useUserContext();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("/mediasoup");

      socket.current.on(
        "connection-success",
        ({ socketId, existsProducer }) => {
          console.log(socketId, existsProducer);
          registerReceivingSocket({ token, socketId });
        }
      );

      setSocketSet(true);
    }
  }, []);

  return (
    <Fragment>
      {socket.current && <ViewPage socket={socket.current} />}
    </Fragment>
  );
};
