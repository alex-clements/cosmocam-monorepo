import { models } from "../services/db.service";

export const checkUserExists = async (email: string): Promise<boolean> => {
  const res = await models.UserData.find({ email }).then(
    (data) => data.length > 0
  );
  return res;
};

export const getUser = async (email: string): Promise<any> => {
  const res = await models.UserData.find({ email });
  return res;
};
