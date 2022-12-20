import mongoose from "mongoose";
import { User } from "@cosmocam/shared";
import { dburi } from "../configs/db.config";

var Schema = mongoose.Schema;

var userDataSchema = new Schema<User>(
  {
    username: String,
    password: String,
    email: String,
  },
  { collection: "user_data" }
);

var UserData = mongoose.model("UserData", userDataSchema);

const connect = async () => {
  await mongoose.connect(dburi);
  console.log("Connected to MongoDB");
  return mongoose;
};

connect();

export const models = { UserData };
