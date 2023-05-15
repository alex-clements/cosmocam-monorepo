import { Fragment, useEffect, useRef, useState } from "react";
import { useUserContext } from "../Context/Providers";
import { ViewPage } from "./ViewPage";
import { io, Socket } from "socket.io-client";
import { registerReceivingSocket } from "../../services/socket";

interface Test {
  updateName: (socketId: string, name: string) => void;
  addNewCamera: (socketId: string, name: string) => void;
  updateSocketData: (socketId: string) => void;
}

export const ViewPageWrapper = () => {
  const socket = useRef<Socket>();
  const nameUpdate = useRef<Test>();
  const [socketSet, setSocketSet] = useState(false);

  const { token } = useUserContext();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("/mediasoup");

      socket.current.on("connection-success", ({ socketId }) => {
        registerReceivingSocket({ token, socketId }).then(() => {
          setSocketSet(true);
        });
      });

      socket.current.on("name-update", ({ socketId, name }) => {
        nameUpdate.current?.updateName(socketId, name);
      });

      socket.current.on("socket-disconnected", ({ socketId }) => {
        nameUpdate.current?.updateSocketData(socketId);
      });

      socket.current.on("camera-added", ({ socketId, name }) => {
        nameUpdate.current?.addNewCamera(socketId, name);
      });
    }
  }, []);

  return (
    <Fragment>
      {socketSet && socket.current && (
        <ViewPage ref={nameUpdate} socket={socket.current} />
      )}
    </Fragment>
  );
};
