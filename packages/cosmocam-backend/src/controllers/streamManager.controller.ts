import { streamManagerService } from "../services/streamManager.service";

const registerSendingSocket = async (req: any, res: any, next: any) => {
  try {
    res.json(await streamManagerService.registerSendingSocket(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const registerReceivingSocket = async (req: any, res: any, next: any) => {
  try {
    res.json(await streamManagerService.registerReceivingSocket(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getActiveStreams = async (req: any, res: any, next: any) => {
  try {
    res.json(await streamManagerService.getActiveStreams(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const streamManagerController = {
  registerSendingSocket,
  registerReceivingSocket,
  getActiveStreams,
};
