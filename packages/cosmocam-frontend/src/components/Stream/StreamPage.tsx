import { Button } from "@mui/material";
import { useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useProducerStream } from "../../hooks/stream";

export const StreamPage = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const { getLocalStream } = useProducerStream(localVideo);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={getLocalStream}>
            Publish
          </Button>
        </Grid>
        <Grid item xs={12}>
          <video autoPlay loop playsInline muted ref={localVideo}></video>
        </Grid>
      </Grid>
    </Box>
  );
};
