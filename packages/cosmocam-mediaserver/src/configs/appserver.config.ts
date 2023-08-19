import dotenv from "dotenv";

// get config vars
dotenv.config();

export const appServerHost =
  process.env.NODE_ENV == "development"
    ? process.env.COSMOCAM_ADDRESS_DEV
    : process.env.COSMOCAM_ADDRESS_PROD;
