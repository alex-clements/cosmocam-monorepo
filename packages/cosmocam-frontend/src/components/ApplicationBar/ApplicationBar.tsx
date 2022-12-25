import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { routes } from "../Routes/RoutesData";
import { pageNames } from "@cosmocam/shared";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

export const ApplicationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle: string = routes[location.pathname]?.pagename;

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            {pageTitle !== pageNames.DASHBOARD && (
              <div onClick={handleBack}>
                <ArrowBack />
              </div>
            )}
            <Box sx={{ flexGrow: 1 }}></Box>
            <Typography variant="h6" color="inherit" component="div">
              {pageTitle}
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};
