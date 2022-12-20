import DashboardCard from "./DashboardCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
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
