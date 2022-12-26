import { useEffect } from "react";
import { authenticateToken } from "../services/authentication";
import { statusMessages, UserCredentials } from "@cosmocam/shared";
import { authenticateUser } from "../services/authentication";
import { userAuthenticationMessages } from "@cosmocam/shared";
import { useUserContext } from "../components/Context/Providers";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { pathNames, cookieValues } from "@cosmocam/shared";
import { useToastContext } from "../components/Context/Providers";

export const useAuthenticateUser = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([cookieValues.USER]);
  const { setUsername, setEmail, setIsLoggedIn, setToken, setIsLoading } =
    useUserContext();
  const { setToastMessage } = useToastContext();

  const returnFunction = async ({ password, email }: UserCredentials) => {
    try {
      const response = await authenticateUser({ password, email });
      if (response.data.message === userAuthenticationMessages.SUCCESS) {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setToken(response.data.token);
        setIsLoggedIn(true);
        setIsLoading(false);

        setCookie(cookieValues.USER, {
          username: response.data.username,
          email: response.data.email,
          token: response.data.token,
        });

        navigate(pathNames.DASHBOARD);
      } else {
        setToastMessage("Wrong username / password combo");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { returnFunction };
};

export const useAuthenticateToken = () => {
  const [cookie, setCookie] = useCookies([cookieValues.USER]);
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
