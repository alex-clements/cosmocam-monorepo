import dotenv from "dotenv";

// get config vars
dotenv.config();

export const appServerHost =
  process.env.NODE_ENV == "development" ? "localhost:3001" : "cosmocam";
