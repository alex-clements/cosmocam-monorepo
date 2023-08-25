import { useState } from "react";
import DashboardCard from "./DashboardCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TvIcon from "@mui/icons-material/Tv";
import VideocamIcon from "@mui/icons-material/Videocam";
import { cookieValues, labels, pathNames } from "@cosmocam/shared";
import { getLabel } from "../../data/labels";
import { Container } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useCookies } from "react-cookie";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "#001e3c",
  border: "2px solid #000",
  borderRadius: 2,
  p: 4,
};

export const Dashboard = () => {
  const [cookie, setCookie] = useCookies([cookieValues.DASHBOARD_HELP_TEXT]);
  const [modalOpen, setModalOpen] = useState<boolean>(
    !cookie[cookieValues.DASHBOARD_HELP_TEXT]
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    setCookie(cookieValues.DASHBOARD_HELP_TEXT, true);
  };

  return (
    <>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography color="white" variant="h6">
            welcome!
          </Typography>
          <Typography color="white" variant="body1" sx={{ marginTop: 1 }}>
            cosmocam is a pet camera that lets you stream video from multiple
            devices.
          </Typography>
          <Typography color="white" variant="body1" sx={{ marginTop: 1 }}>
            log in from a few different devices and stream video of multiple
            angles of your home from the stream page.
          </Typography>
          <Typography color="white" variant="body1" sx={{ marginTop: 1 }}>
            log in from another device to view the streams on the watch page.
          </Typography>
        </Box>
      </Modal>
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
    </>
  );
};
