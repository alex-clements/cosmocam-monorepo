import { ReactNode, useState } from "react";
import { useContext, createContext } from "react";
import {
  UserContextInterface,
  ToastContextInterface,
  ToastType,
} from "@cosmocam/shared";
import { CookiesProvider } from "react-cookie";
import { Toast } from "../SharedComponents/Toast";

interface ProvidersProps {
  children: ReactNode;
}

const ToastContext = createContext<ToastContextInterface>({
  toast: () => {},
});

const UserContext = createContext<UserContextInterface>({
  username: "",
  email: "",
  token: "",
  isLoggedIn: false,
  isLoading: true,
  setUsername: () => {},
  setEmail: () => {},
  setToken: () => {},
  setIsLoggedIn: () => {},
  setIsLoading: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const useToastContext = () => useContext(ToastContext);

export const Providers = ({ children }: ProvidersProps) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastType, setToastType] = useState<ToastType>("info");

  const toast = (message: string, toastType: ToastType) => {
    setToastOpen(true);
    setToastMessage(message);
    setToastType(toastType);
    setTimeout(() => {
      setToastOpen(false);
    }, 1000);
  };

  return (
    <CookiesProvider>
      <UserContext.Provider
        value={{
          username,
          email,
          token,
          isLoading,
          isLoggedIn,
          setUsername,
          setEmail,
          setToken,
          setIsLoading,
          setIsLoggedIn,
        }}
      >
        <ToastContext.Provider value={{ toast }}>
          <Toast
            messageProp={toastMessage}
            openProp={toastOpen}
            typeProp={toastType}
          />
          {children}
        </ToastContext.Provider>
      </UserContext.Provider>
    </CookiesProvider>
  );
};
