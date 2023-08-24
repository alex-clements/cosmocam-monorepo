import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CosmoHead from "../../data/cosmohead.png";
import { useUserContext } from "../Context/Providers";
import { AccountButton } from "./AccountButton";
import { useNavigate } from "react-router";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const styleProps = {
  width: "35px",
  height: "35px",
  overflow: "hidden",
  backgroundColor: "#0C5E65",
  borderRadius: "50%",
  marginRight: "15px",
  border: "solid",
  borderColor: "black",
  borderWidth: "1px",
  marginTop: "5px",
  marginBottom: "5px",
};

const imgProps = {
  margin: "-5px 0px 0px -4px",
};

export const Headerbar = () => {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <div style={styleProps} onClick={() => navigate("/dashboard")}>
              <img
                width="45px"
                height="45px"
                style={imgProps}
                src={CosmoHead}
                alt="cosmo head"
              />
            </div>
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              sx={{ float: "left" }}
            >
              cosmocam
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            {isLoggedIn && <AccountButton />}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};
