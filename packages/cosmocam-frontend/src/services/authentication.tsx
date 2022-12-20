import axios from "axios";
import { UserCredentials, apis, TokenProps } from "@cosmocam/shared";

export const authenticateUser = async ({
  password,
  email,
}: UserCredentials) => {
  return axios.post(apis.AUTHENTICATE_USER, { password, email });
};

export const authenticateToken = async ({ token }: TokenProps) => {
  return axios.post(apis.AUTHENTICATE_TOKEN, { token });
};

export const logout = async ({ token }: TokenProps) => {
  return axios.post(apis.LOGOUT, { token });
};
