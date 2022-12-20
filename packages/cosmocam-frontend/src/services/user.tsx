import axios from "axios";
import { User, UserUpdate, apis, CosmocamResponse } from "@cosmocam/shared";

export const register = async ({
  username,
  password,
  email,
}: User): Promise<CosmocamResponse> => {
  return axios.post(apis.REGISTER, { username, password, email });
};

export const update = async ({
  username,
  oldPassword,
  newPassword,
  email,
}: UserUpdate): Promise<{ data: CosmocamResponse }> => {
  return axios.put(apis.UPDATE_USER, {
    username,
    oldPassword,
    newPassword,
    email,
  });
};
