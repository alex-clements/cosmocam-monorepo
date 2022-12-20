import { authenticationService } from "../services/authentication.service";

const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    res.json(await authenticationService.authenticateUser(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const authenticateToken = async (req: any, res: any, next: any) => {
  try {
    res.json(await authenticationService.authenticateToken(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const logout = async (req: any, res: any, next: any) => {
  try {
    res.json(await authenticationService.logout(req.body));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const authenticationController = {
  authenticateUser,
  authenticateToken,
  logout,
};
