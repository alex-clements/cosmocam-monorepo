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
  try {
    await mongoose.connect(dburi);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log("could not connect to MongoDB");
    console.log(e);
  }
  return mongoose;
};

connect();

export const models = { UserData };
