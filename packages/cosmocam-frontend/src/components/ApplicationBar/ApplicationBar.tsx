import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router";
import { ArrowBack } from "@mui/icons-material";
import { routes } from "../Routes/RoutesData";
import { pageNames, pathNames } from "@cosmocam/shared";
import { IconButton } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#0C2D48",
    },
  },
});

export const ApplicationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle: string = routes[location.pathname]?.pagename;

  const handleBack = () => {
    navigate(pathNames.DASHBOARD);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            {pageTitle !== pageNames.DASHBOARD && (
              <IconButton size="medium" onClick={handleBack}>
                <ArrowBack sx={{ color: "white" }} fontSize="inherit" />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                sx={{
                  marginRight: pageTitle === pageNames.DASHBOARD ? 0 : "40px",
                }}
              >
                {pageTitle}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
};
