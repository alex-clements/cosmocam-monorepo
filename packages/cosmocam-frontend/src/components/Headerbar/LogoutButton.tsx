import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserContext } from "../Context/Providers";

export const LogoutButton = () => {
  const { token } = useUserContext();
  const navigate = useNavigate();
  const handleClick = async () => {
    // TODO: Revoke token
    navigate("/", { replace: true });
  };
  return (
    <motion.div>
      <Button onClick={handleClick} color="inherit" variant="text">
        log out
      </Button>
    </motion.div>
  );
};
