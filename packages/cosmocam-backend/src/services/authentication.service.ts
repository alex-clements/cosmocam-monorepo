import {
  UserCredentials,
  userAuthenticationMessages,
  CosmocamResponse,
  statusMessages,
  TokenProps,
} from "@cosmocam/shared";
import { comparePassword } from "../utils/password.util";
import { generateAccessToken } from "../utils/tokenVerification.util";
import { checkUserExists, getUser } from "../utils/user.util";
import jwt from "jsonwebtoken";
import { TokenBlacklist } from "../utils/tokenBlacklist.util";

const hasLoginData = (data: any): boolean => {
  return data.hasOwnProperty("email") && data.hasOwnProperty("password");
};

const authenticateUser = async (
  loginData: UserCredentials
): Promise<CosmocamResponse> => {
  if (!hasLoginData(loginData)) {
    return {
      status: statusMessages.NOT_OK,
      message: userAuthenticationMessages.INVALID_DATA,
    };
  }

  const { email: loginEmail, password: loginPassword } = loginData;

  const userExists = await checkUserExists(loginEmail);
  if (!userExists) {
    return {
      status: statusMessages.NOT_OK,
      message: userAuthenticationMessages.USER_NOT_EXIST,
    };
  }

  const user = await getUser(loginEmail);

  const {
    username: userUsername,
    password: userPassword,
    email: userEmail,
  } = user[0];

  const hashedPassword = userPassword;
  const passwordCorrect = await comparePassword(loginPassword, hashedPassword);
  if (passwordCorrect) {
    const token = generateAccessToken(loginEmail);

    return {
      status: statusMessages.OK,
      message: userAuthenticationMessages.SUCCESS,
      token,
      username: userUsername,
      email: userEmail,
    };
  } else {
    return {
      status: statusMessages.NOT_OK,
      message: userAuthenticationMessages.PASSWORD_INCORRECT,
    };
  }
};

const authenticateToken = async ({
  token,
}: TokenProps): Promise<CosmocamResponse> => {
  let tokenBlacklist = TokenBlacklist.getInstance();

  if (!token || tokenBlacklist.hasToken(token))
    return {
      status: statusMessages.NOT_OK,
      message: userAuthenticationMessages.TOKEN_NOT_VALID,
    };

  let userResponse: { username: string } | undefined;

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: any) => {
      userResponse = user;
    }
  );

  if (userResponse) {
    const user = await getUser(userResponse.username);

    const { email: userEmail, username: userUsername } = user[0];

    return {
      status: statusMessages.OK,
      message: userAuthenticationMessages.TOKEN_VALIDATED,
      username: userUsername,
      email: userEmail,
    };
  } else {
    return {
      status: statusMessages.NOT_OK,
      message: userAuthenticationMessages.TOKEN_EXPIRED,
    };
  }
};

const logout = async ({ token }: TokenProps): Promise<CosmocamResponse> => {
  let tokenBlacklist = TokenBlacklist.getInstance();
  tokenBlacklist.addToken(token);

  return {
    status: statusMessages.OK,
    message: userAuthenticationMessages.LOGGED_OUT,
  };
};

export const authenticationService = {
  authenticateUser,
  authenticateToken,
  logout,
};
