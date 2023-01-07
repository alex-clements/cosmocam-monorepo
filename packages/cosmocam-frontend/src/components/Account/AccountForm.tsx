import { Button, Stack } from "@mui/material";
import { update } from "../../services/user";
import { useUserContext } from "../Context/Providers";
import { useState } from "react";
import { motion } from "framer-motion";
import { CssTextField } from "../SharedComponents/SharedComponents";
import { Toast } from "../SharedComponents/Toast";
import { labels } from "@cosmocam/shared";
import { getLabel } from "../../data/labels";

export const AccountForm = () => {
  const { username, email } = useUserContext();
  const [newUsername, setNewUsername] = useState<string>(username);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Toast messageProp={toastMessage} openProp={toastOpen} />
      <Stack sx={{ color: "white" }} spacing={2}>
        <CssTextField
          id="outlined-basic"
          label={getLabel(labels.USERNAME)}
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
          label={getLabel(labels.OLD_PASSWORD)}
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
          label={getLabel(labels.NEW_PASSWORD)}
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
