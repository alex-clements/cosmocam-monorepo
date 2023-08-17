import { streamManagerService } from "../services/streamManager.service";

/* Register Sending Socket */
const registerSendingSocket = async (req: any, res: any, next: any) => {
  try {
    res.json(await streamManagerService.registerSendingSocket(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* Register Receiving Socket */
const registerReceivingSocket = async (req: any, res: any, next: any) => {
  try {
    res.json(await streamManagerService.registerReceivingSocket(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* GET Active Streams List */
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
