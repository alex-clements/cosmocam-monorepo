import { Container, Typography } from "@mui/material";

export const ViewStreamEmptyState = () => {
  return (
    <Container sx={{ paddingTop: "50px" }}>
      <Typography variant="h5" color="white" component="div">
        No cameras connected
      </Typography>
      <Typography variant="body1" color="white" component="div">
        Try connecting a camera from another browser tab or another device :)
      </Typography>
    </Container>
  );
};
