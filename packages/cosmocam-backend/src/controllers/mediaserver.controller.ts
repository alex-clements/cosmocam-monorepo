import { mediaserverService } from "../services/mediaserver.service";

const getMediaServer = async (req: any, res: any, next: any) => {
  try {
    res.json(await mediaserverService.getMediaServer(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const mediaserverController = {
  getMediaServer,
};
