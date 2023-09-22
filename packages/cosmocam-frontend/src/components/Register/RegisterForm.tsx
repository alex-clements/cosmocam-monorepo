import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import { CssTextField } from "../SharedComponents/SharedComponents";
import { register } from "../../services/user";
import { statusMessages } from "@cosmocam/shared";
import { useNavigate } from "react-router";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  const handleKeyDown = (e: any) => {
    if (e.code === "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    emailValid &&
      usernameValid &&
      passwordValid &&
      register({ username, password, email })
        .then((response) => {
          if ((response.status = statusMessages.OK)) {
            navigate("/dashboard");
          } else {
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const regex: RegExp = new RegExp("(\\w)+@(\\w)+.(\\w)+$");

  const validateUsername = (text: string) => {
    setUsernameValid(text.length > 0);
    setUsername(text);
  };

  const validatePassword = (text: string) => {
    setPasswordValid(text.length > 0);
    setPassword(text);
  };

  const validateEmail = (text: string) => {
    setEmailValid(regex.test(text));
    setEmail(text);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>
      <Stack sx={{ color: "white" }} spacing={2}>
        <CssTextField
          id="outlined-basic"
          label="username"
          variant="outlined"
          value={username}
          onChange={(e) => validateUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          color="primary"
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <CssTextField
          id="outlined-password-input"
          variant="outlined"
          label="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => validatePassword(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <CssTextField
          id="outlined-basic"
          variant="outlined"
          label="email"
          value={email}
          onChange={(e) => validateEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <Button onClick={handleSubmit} variant="contained">
          register
        </Button>
      </Stack>
    </motion.div>
  );
};
