import { forwardRef, useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useReceiverStream } from "../../hooks/stream";
import { ViewStream } from "./ViewStream";
import { Socket } from "socket.io-client";
import { Container } from "@mui/material";

interface ViewPageProps {
  socket: Socket;
}

export const ViewPage = forwardRef(
  ({ socket }: ViewPageProps, nameUpdateRef) => {
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const { goConsume, fetchProducerId, fetchNewProducerId } =
      useReceiverStream(socket, remoteVideoRef);

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="xl">
          <Grid container spacing={1} sx={{ marginTop: 1 }}>
            <ViewStream
              goConsume={goConsume}
              fetchProducerId={fetchProducerId}
              fetchNewProducerId={fetchNewProducerId}
              remoteVideoRef={remoteVideoRef}
              ref={nameUpdateRef}
            />
          </Grid>
        </Container>
      </Box>
    );
  }
);
