import DashboardCard from "./DashboardCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TvIcon from "@mui/icons-material/Tv";
import VideocamIcon from "@mui/icons-material/Videocam";
import { labels, pathNames } from "@cosmocam/shared";
import { getLabel } from "../../data/labels";
import { Container } from "@mui/material";

export const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, paddingTop: 3 }}>
      <Container maxWidth="lg" sx={{ marginBottom: 5 }}>
        <Typography variant="body1" color="white" sx={{ paddingTop: 1 }}>
          get started by streaming video from one or more devices
        </Typography>
        <Typography variant="body1" color="white" sx={{ paddingTop: 1 }}>
          then check out the streams from another
        </Typography>
        <Grid container spacing={0}>
          <Grid item xs={6} sx={{ marginTop: 5 }}>
            <Container>
              <DashboardCard
                headerText={getLabel(labels.CAPTURE)}
                toolTipText="stream video from a device"
                url={pathNames.STREAM}
              >
                <VideocamIcon sx={{ fontSize: "100px" }} />
              </DashboardCard>
            </Container>
          </Grid>
          <Grid item xs={6} sx={{ marginTop: 5 }}>
            <Container>
              <DashboardCard
                toolTipText="watch video feeds"
                headerText={getLabel(labels.WATCH)}
                url={pathNames.VIEW}
              >
                <TvIcon sx={{ fontSize: "100px" }} />
              </DashboardCard>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
