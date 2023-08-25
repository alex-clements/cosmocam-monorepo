import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { motion } from "framer-motion";

const LoginHeading = () => {
  const [visible, setVisible] = useState<boolean>(true);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>
      <Container>
        <Typography variant="h3" color="white" sx={{ paddingY: 1 }}>
          cosmocam
        </Typography>
        <Typography variant="h5" color="LightGray">
          web-based pet camera
        </Typography>
        <Typography variant="body1" color="LightGray" sx={{ marginTop: 2 }}>
          log in or create an account to get started
        </Typography>
        <Typography variant="body2" color="LightGray" sx={{ marginTop: 2 }}>
          (supported in Chrome and Safari)
        </Typography>
      </Container>
    </motion.div>
  );
};

export default LoginHeading;
