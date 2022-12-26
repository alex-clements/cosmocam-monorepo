export enum apis {
  REGISTER = "users/register",
  AUTHENTICATE_USER = "/authenticate/user",
  AUTHENTICATE_TOKEN = "/authenticate/token",
  LOGOUT = "/authenticate/logout",
  UPDATE_USER = "/users/update",
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
  LOGIN = "Login",
  REGISTER = "Register",
  DASHBOARD = "Dashboard",
  STREAM = "Stream Video",
  VIEW = "View",
  ACCOUNT = "Account Settings",
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
}

export enum statusMessages {
  OK = "ok",
  NOT_OK = "not ok",
}
