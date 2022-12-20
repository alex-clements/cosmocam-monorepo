import { ReactNode, useState } from "react";
import { useContext, createContext } from "react";
import { UserContextInterface } from "@cosmocam/shared";
import { CookiesProvider } from "react-cookie";

interface ProvidersProps {
  children: ReactNode;
}

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

export const Providers = ({ children }: ProvidersProps) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
        {children}
      </UserContext.Provider>
    </CookiesProvider>
  );
};
