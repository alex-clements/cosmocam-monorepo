import { Container, Typography } from "@mui/material";

export const ViewStreamEmptyState = () => {
  return (
    <Container>
      <Typography variant="h5" color="white" component="div">
        No cameras connected
      </Typography>
      <Typography variant="body1" color="white" component="div">
        Try connecting a camera and reloading the page :)
      </Typography>
    </Container>
  );
};
