import { useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useReceiverStream } from "../../hooks/stream";
import { ViewStream } from "./ViewStream";
import { Socket } from "socket.io-client";

export const ViewPage = ({ socket }: { socket: Socket }) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { goConsume, fetchProducerId } = useReceiverStream(
    socket,
    remoteVideoRef
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}></Grid>

        <ViewStream
          goConsume={goConsume}
          fetchProducerId={fetchProducerId}
          remoteVideoRef={remoteVideoRef}
        />
      </Grid>
    </Box>
  );
};
