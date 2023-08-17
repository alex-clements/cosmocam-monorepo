import axios from "axios";
import { TokenProps, apis } from "@cosmocam/shared";
import { createURL } from "./url-helpers";

export const authenticateToken = async ({ token }: TokenProps) => {
  let url = createURL(apis.AUTHENTICATE_TOKEN);
  return axios.post(url, { token });
};
