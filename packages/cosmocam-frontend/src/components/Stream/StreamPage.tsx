import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useProducerStream } from "../../hooks/stream";
import { VideoDeviceSelect } from "./VideoDeviceSelect";

export const StreamPage = ({ socket }) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const [activeDevice, setActiveDevice] = useState<string>("");
  useProducerStream({
    socket,
    localVideo,
    deviceId: activeDevice,
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <video
            height="240px"
            autoPlay
            loop
            playsInline
            muted
            ref={localVideo}
          ></video>
        </Grid>
        <Grid item xs={12} sm={3}>
          <VideoDeviceSelect setActiveDevice={setActiveDevice} />
        </Grid>
      </Grid>
    </Box>
  );
};
