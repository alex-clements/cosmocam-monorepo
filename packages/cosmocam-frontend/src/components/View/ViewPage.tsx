import { Button } from "@mui/material";
import { useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useReceiverStream } from "../../hooks/stream";
import { ViewStream } from "./ViewStream";
import { useEffect, useState } from "react";
import { fetchActiveStreams } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

export const ViewPage = () => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { goConsume } = useReceiverStream(remoteVideoRef);
  const [producerIds, setProducerIds] = useState<string[]>([]);
  const { token } = useUserContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}></Grid>

        <ViewStream goConsume={goConsume} remoteVideoRef={remoteVideoRef} />
      </Grid>
    </Box>
  );
};
