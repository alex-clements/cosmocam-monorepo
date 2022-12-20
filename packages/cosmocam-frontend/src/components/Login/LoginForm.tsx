import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import { Link } from "@mui/material";
import { CssTextField } from "../SharedComponents/SharedComponents";
import { useAuthenticateUser } from "../../hooks/authentication";

const LoginForm = () => {
  const [email, setEmailState] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState<boolean>(true);

  const handleKeyDown = (e: any) => {
    if (e.code == "Enter") handleSubmit();
  };

  const { returnFunction: authenticateUser } = useAuthenticateUser();

  const handleSubmit = async () => {
    authenticateUser({ email, password });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>
      <Stack sx={{ color: "white" }} spacing={2}>
        <CssTextField
          id="outlined-basic"
          label="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmailState(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <Button onClick={handleSubmit} variant="contained">
          Login
        </Button>
        <Link href="register">Create Account</Link>
      </Stack>
    </motion.div>
  );
};

export default LoginForm;
