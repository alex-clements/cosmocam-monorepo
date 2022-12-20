import { models } from "./db.service";
import {
  CosmocamResponse,
  User,
  userCreationMessages,
  statusMessages,
  UserUpdate,
} from "@cosmocam/shared";
import { hashPassword, comparePassword } from "../utils/password.util";
import { checkUserExists, getUser } from "../utils/user.util";

const create = async (userData: User) => {
  let response: CosmocamResponse;
  if (
    // TODO: type check
    userData.hasOwnProperty("username") &&
    userData.hasOwnProperty("email") &&
    userData.hasOwnProperty("password")
  ) {
    let userExists = await checkUserExists(userData.email);
    if (userExists) {
      response = {
        status: statusMessages.NOT_OK,
        message: userCreationMessages.USER_ALREADY_EXISTS,
      };
      return response;
    }

    let hashedPassword = await hashPassword(userData.password);
    var data = new models.UserData({ ...userData, password: hashedPassword });
    await data
      .save()
      .then((user) => {})
      .catch((err) => {
        console.log(err);
      });
    response = {
      status: statusMessages.OK,
      message: userCreationMessages.CREATED_SUCCESSFULLY,
    };
  } else {
    response = {
      status: statusMessages.NOT_OK,
      message: userCreationMessages.NOT_CREATED,
    };
  }
  return response;
};

const update = async (userData: UserUpdate): Promise<CosmocamResponse> => {
  const { email, username, oldPassword, newPassword } = userData;

  const userExists = await checkUserExists(email);
  if (!userExists) {
    return {
      status: statusMessages.NOT_OK,
      message: "user does not exist",
    };
  }

  const user = await getUser(email);
  const filter = { email };
  let hashedNewPassword;

  if (oldPassword && newPassword) {
    const passwordsMatch = await comparePassword(oldPassword, user[0].password);
    if (passwordsMatch) {
      hashedNewPassword = await hashPassword(newPassword);
    } else {
      return {
        status: statusMessages.NOT_OK,
        message: "old password not correct",
      };
    }
  }

  const update = {
    ...(hashedNewPassword && { password: hashedNewPassword }),
    ...(username && { username }),
  };

  await models.UserData.findOneAndUpdate(filter, update);

  return { status: statusMessages.OK, message: "account updated" };
};

export const userService = { create, update };
