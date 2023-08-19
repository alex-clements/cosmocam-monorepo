import { Fragment, useEffect, useRef, useState } from "react";
import { useUserContext } from "../Context/Providers";
import { ViewPage } from "./ViewPage";
import { io, Socket } from "socket.io-client";
import {
  fetchActiveStreams,
  registerReceivingSocket,
} from "../../services/socket";
import { fetchUserMediaServer } from "../../services/mediaserver";
import { apis } from "@cosmocam/shared";

interface Test {
  updateName: (socketId: string, name: string) => void;
  addNewCamera: (socketId: string, name: string) => void;
  updateSocketData: (socketId: string) => void;
  restartStream: () => void;
}

export const ViewPageWrapper = () => {
  const socket = useRef<Socket>();
  const nameUpdate = useRef<Test>();
  const [socketSet, setSocketSet] = useState(false);

  const { token } = useUserContext();

  useEffect(() => {
    setupSocket();
  }, []);

  const setupSocket = async () => {
    if (!socket.current) {
      let val = await fetchUserMediaServer({ token });
      let mediaServerUrl = val.data;

      let test = await fetchActiveStreams({ token, mediaServerUrl });
      console.log(test);

      console.log("user media server: ", val);

      socket.current = io("https://" + mediaServerUrl + "/mediasoup");

      socket.current.on("connection-success", ({ socketId }) => {
        registerReceivingSocket({ token, socketId, mediaServerUrl }).then(
          () => {
            setSocketSet(true);
          }
        );
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

      socket.current.on("restart-stream", () => {
        nameUpdate.current?.restartStream();
      });
    }
  };

  return (
    <Fragment>
      {socketSet && socket.current && (
        <ViewPage ref={nameUpdate} socket={socket.current} />
      )}
    </Fragment>
  );
};
