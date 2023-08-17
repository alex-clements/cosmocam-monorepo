import axios from "axios";
import { UserCredentials, apis, TokenProps } from "@cosmocam/shared";
import { createURL } from "../../util/url-helpers";

const authenticateAccessToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  let url = createURL(apis.AUTHENTICATE_TOKEN);
  let val = await axios.post(url, { token });

  try {
    req.body.user = {};
    req.body.username = val.data.username;
    req.body.email = val.data.email;
  } catch (err) {
    console.log(err);
  }

  next();
};

export const tokenAuthenticationMiddleware = { authenticateAccessToken };
