import axios from "axios";

export const fetchUserMediaServer = async ({
  token,
}: any): Promise<{ data: any }> => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };

  return axios.get("/mediaserver/user", { headers });
};
