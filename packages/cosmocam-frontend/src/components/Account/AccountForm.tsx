import { Button, Stack } from "@mui/material";
import { update } from "../../services/user";
import { useUserContext } from "../Context/Providers";
import { useState } from "react";
import { motion } from "framer-motion";
import { CssTextField } from "../SharedComponents/SharedComponents";
import { Toast } from "../SharedComponents/Toast";

export const AccountForm = () => {
  const { username, email } = useUserContext();
  const [newUsername, setNewUsername] = useState<string>(username);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  console.log("test");

  const handleSubmit = () => {
    update({
      username: newUsername,
      email,
      ...(oldPassword && { oldPassword }),
      ...(newPassword && { newPassword }),
    }).then((response) => {
      setToastMessage(response.data.message);
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 1000);
    });
  };

  const handleKeyDown = (e: any) => {
    if (e.code == "Enter") handleSubmit();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>
      <Toast messageProp={toastMessage} openProp={toastOpen} />
      <Stack sx={{ color: "white" }} spacing={2}>
        <CssTextField
          id="outlined-basic"
          label="username"
          variant="outlined"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
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
          label="old password"
          type="password"
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <CssTextField
          id="outlined-password-input"
          variant="outlined"
          label="new password"
          type="password"
          autoComplete="current-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ input: { color: "white" } }}
          InputLabelProps={{
            style: { color: "white" },
          }}
        />
        <Button onClick={handleSubmit} variant="contained">
          update
        </Button>
      </Stack>
    </motion.div>
  );
};
