import DashboardCard from "./DashboardCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useUserContext } from "../Context/Providers";
import Typography from "@mui/material/Typography";

export const Dashboard = () => {
  const { username } = useUserContext();

  return (
    <Box sx={{ flexGrow: 1, paddingTop: 3 }}>
      <Typography variant="h4" color="white" component="div">
        Welcome {username}
      </Typography>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6} sm={12} sx={{ marginTop: 5 }}>
          <DashboardCard headerText={"Stream Video"} url={"/stream"} />
        </Grid>
        <Grid item xs={12} md={6} sm={12} sx={{ marginTop: 5 }}>
          <DashboardCard headerText={"View Streams"} url={"/view"} />
        </Grid>
      </Grid>
    </Box>
  );
};
