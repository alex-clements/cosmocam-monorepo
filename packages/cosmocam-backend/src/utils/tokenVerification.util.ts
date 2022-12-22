import dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";

// get config vars
dotenv.config();

export const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, process.env.TOKEN_SECRET as string, {
    expiresIn: "300s",
  });
};
