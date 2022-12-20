import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password: string) => {
  let hash = await bcrypt.hash(password, saltRounds).then((hash) => {
    return hash;
  });
  return hash;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  let response = await bcrypt.compare(password, hashedPassword);
  return response;
};
