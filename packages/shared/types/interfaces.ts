import { Dispatch, SetStateAction } from "react";

export interface User {
  username: string;
  password: string;
  email: string;
}

export interface UserUpdate {
  username: string;
  email: string;
  newPassword?: string;
  oldPassword?: string;
}

export interface CosmocamResponse {
  status: string;
  message: string;
  token?: string;
  username?: string;
  email?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface TokenProps {
  token: string;
}

export interface UserContextInterface {
  username: string;
  email: string;
  token: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUsername: Dispatch<SetStateAction<string>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setToken: Dispatch<SetStateAction<string>>;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export interface ToastContextInterface {
  toastMessage: string;
  setToastMessage: Dispatch<SetStateAction<string>>;
}

export interface RequiredLabels {
  email: string;
  password: string;
  login: string;
  createAccount: string;
  dashboard: string;
  welcome: string;
  capture: string;
  streamVideo: string;
  watch: string;
  viewStreams: string;
  account: string;
  logout: string;
  oldPassword: string;
  newPassword: string;
  username: string;
}

export interface SocketData {
  socketId: string;
  socketName: string;
}
