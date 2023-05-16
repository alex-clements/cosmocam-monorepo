import { Container, Stack, Typography } from "@mui/material";

interface VideoProps {
  socketName?: string;
  videoHeight: number;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

export const Video = ({
  socketName,
  videoHeight,
  remoteVideoRef,
}: VideoProps) => {
  return (
    <Stack spacing={2}>
      {socketName && (
        <Typography variant="h6" color="white" component="div">
          Currently Watching {socketName}
        </Typography>
      )}
      <Container maxWidth="md" disableGutters sx={{ backgroundColor: "black" }}>
        <video
          height={`${videoHeight}px`}
          width="100%"
          autoPlay
          loop
          playsInline
          muted
          controls
          ref={remoteVideoRef}
        ></video>
      </Container>
    </Stack>
  );
};
