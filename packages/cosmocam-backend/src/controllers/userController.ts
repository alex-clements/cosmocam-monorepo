import { userService } from "../services/user.service";

const create = async (req: any, res: any, next: any) => {
  try {
    res.json(await userService.create(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const update = async (req: any, res: any, next: any) => {
  try {
    res.json(await userService.update(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const userController = { create, update };
