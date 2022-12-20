import { useEffect } from "react";
import { authenticateToken } from "../services/authentication";
import { statusMessages, UserCredentials } from "@cosmocam/shared";
import { authenticateUser } from "../services/authentication";
import { userAuthenticationMessages } from "@cosmocam/shared";
import { useUserContext } from "../components/Context/Providers";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const useAuthenticateUser = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["user"]);
  const { setUsername, setEmail, setIsLoggedIn, setToken, setIsLoading } =
    useUserContext();

  const returnFunction = ({ password, email }: UserCredentials) => {
    authenticateUser({ password, email })
      .then((response) => {
        if (response.data.message === userAuthenticationMessages.SUCCESS) {
          setUsername(response.data.username);
          setEmail(response.data.email);
          setToken(response.data.token);
          setIsLoggedIn(true);
          setIsLoading(false);

          setCookie("user", {
            username: response.data.username,
            email: response.data.email,
            token: response.data.token,
          });

          navigate("/dashboard");
        }
      })
      .catch((err) => console.log(err));
  };

  return { returnFunction };
};

export const useAuthenticateToken = () => {
  const [cookie, setCookie] = useCookies(["user"]);
  const mytoken = cookie?.user?.token;
  const { setUsername, setEmail, setIsLoggedIn, setIsLoading, setToken } =
    useUserContext();

  useEffect(() => {
    authenticateToken({ token: mytoken })
      .then((response) => {
        if (response.data.status === statusMessages.NOT_OK) {
          setIsLoggedIn(false);
          setIsLoading(false);
        } else {
          setUsername(response.data.username);
          setEmail(response.data.email);
          setToken(mytoken);
          setIsLoading(false);
          setIsLoggedIn(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoggedIn(false);
        setIsLoading(false);
      });
  }, []);
};
