import axios from "axios";
import { UserCredentials, apis, TokenProps } from "@cosmocam/shared";

const authenticateAccessToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  let url = "https://cosmocamserver" + apis.AUTHENTICATE_TOKEN;
  let val = await axios.post(url, { token });

  try {
    console.log("val");
  } catch (err) {}

  next();
};

export const tokenAuthenticationMiddleware = { authenticateAccessToken };
