import { StreamManagerSingleton } from "../models/StreamManager/StreamManagerSingleton";

const registerSendingSocket = (body: any) => {
  const streamManager = StreamManagerSingleton.getStreamManager();
  const username = body.user.username;
  const socketId = body.socketId;

  streamManager.addUser(username);
  streamManager.registerSendingSocket(username, socketId);

  return { status: "ok" };
};

const registerReceivingSocket = (body: any) => {
  const streamManager = StreamManagerSingleton.getStreamManager();
  const username = body.user.username;
  const socketId = body.socketId;

  streamManager.addUser(username);
  streamManager.registerReceivingSocket(username, socketId);

  return { status: "ok" };
};

const getActiveStreams = (body: any) => {
  const streamManager = StreamManagerSingleton.getStreamManager();
  const username = body.user.username;

  const user = streamManager.getUser(username);

  if (user) {
    const { socketData } = user?.getActiveStreams();
    return { socketData };
  } else {
    throw new Error("User Not Found");
  }
};

export const streamManagerService = {
  registerSendingSocket,
  registerReceivingSocket,
  getActiveStreams,
};
