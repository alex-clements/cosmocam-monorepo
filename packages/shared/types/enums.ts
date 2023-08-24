export enum apis {
  REGISTER = "users/register",
  AUTHENTICATE_USER = "/authenticate/user",
  AUTHENTICATE_TOKEN = "/authenticate/token",
  LOGOUT = "/authenticate/logout",
  UPDATE_USER = "/users/update",
  REGISTER_SENDING_SOCKET = "/streamManager/registerSendingSocket",
  REGISTER_RECEIVING_SOCKET = "/streamManager/registerReceivingSocket",
  GET_ACTIVE_STREAMS = "/streamManager/activeStreams",
}

export enum pathNames {
  LOGIN = "/",
  REGISTER = "/register",
  DASHBOARD = "/dashboard",
  STREAM = "/stream",
  VIEW = "/view",
  ACCOUNT = "/account",
}

export enum cookieValues {
  USER = "user",
}

export enum pageNames {
  LOGIN = "login",
  REGISTER = "register",
  DASHBOARD = "dashboard",
  STREAM = "stream video",
  VIEW = "view",
  ACCOUNT = "account settings",
}

export enum userCreationMessages {
  CREATED_SUCCESSFULLY = "user created successfully",
  NOT_CREATED = "user not created",
  USER_ALREADY_EXISTS = "user already exists",
}

export enum userAuthenticationMessages {
  INVALID_DATA = "payload not valid",
  USER_NOT_EXIST = "user does not exist",
  SUCCESS = "login successful",
  PASSWORD_INCORRECT = "incorrect password",
  TOKEN_NOT_VALID = "token not valid",
  TOKEN_VALIDATED = "token validated",
  TOKEN_EXPIRED = "token expired",
  LOGGED_OUT = "logged out",
}

export enum statusMessages {
  OK = "ok",
  NOT_OK = "not ok",
}

export enum labels {
  EMAIL = "email",
  PASSWORD = "password",
  OLD_PASSWORD = "oldPassword",
  NEW_PASSWORD = "newPassword",
  USERNAME = "username",
  LOGIN = "login",
  CREATE_ACCOUNT = "createAccount",
  DASHBOARD = "dashboard",
  WELCOME = "welcome",
  CAPTURE = "capture",
  STREAM_VIDEO = "streamVideo",
  WATCH = "watch",
  VIEW_STREAMS = "viewStreams",
  ACCOUNT = "account",
  LOGOUT = "logout",
}

export enum loggingFiles {
  FRONTEND_STREAM = 0,
  SENDING_SOCKET = 0,
  RECEIVING_SOCKET = 0,
  BACKEND_SOCKET = 0,
  STREAM_MANAGER = 0,
  USER = 0,
}
