import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useFetchActiveStreams } from "../../hooks/stream";
import { useGetWindowSize } from "../../hooks/util";
import { ViewStreamEmptyState } from "./ViewStreamEmptyState";

interface ViewStreamProps {
  goConsume: any;
  fetchProducerId: any;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

export const ViewStream = ({
  goConsume,
  fetchProducerId,
  remoteVideoRef,
}: ViewStreamProps) => {
  const [selectedProducerSocketId, setSelectedProducerSocketId] = useState();

  const { windowHeight } = useGetWindowSize();

  const windowHeightAdjusted = windowHeight - 2 * 100;

  const {
    activeStreams: producerSocketIds,
    isLoading: isLoadingActiveStreams,
  } = useFetchActiveStreams();

  console.log(isLoadingActiveStreams);

  useEffect(() => {
    if (!isLoadingActiveStreams) {
      fetchProducerId(producerSocketIds[0]);
      setSelectedProducerSocketId(producerSocketIds[0]);
    }
  }, [isLoadingActiveStreams]);

  const fetchProducerIdHandler = (id) => {
    if (id !== selectedProducerSocketId) {
      setSelectedProducerSocketId(id);
      fetchProducerId(id);
    }
  };

  return isLoadingActiveStreams ? (
    <CircularProgress />
  ) : producerSocketIds.length === 0 ? (
    <ViewStreamEmptyState />
  ) : (
    <>
      <Grid item xs={12} lg={3} order={{ xs: 2, lg: 1 }}>
        {/* <Box display={{ xs: "none", md: "block" }}> */}
        <Container maxWidth="xs">
          <Stack spacing={2}>
            <Typography variant="h6" color="white" component="div">
              Available Cameras
            </Typography>
            {producerSocketIds.map((id) => (
              <Button
                key={id}
                variant="contained"
                onClick={() => fetchProducerIdHandler(id)}
              >
                {id}
              </Button>
            ))}
          </Stack>
        </Container>
        {/* </Box> */}
      </Grid>
      <Grid item xs={12} lg={9} order={{ xs: 1, lg: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6" color="white" component="div">
            Currently Watching {selectedProducerSocketId}
          </Typography>
          <Container
            maxWidth="md"
            disableGutters
            sx={{ backgroundColor: "black" }}
          >
            <video
              height={`${windowHeightAdjusted}px`}
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
      </Grid>
    </>
  );
};
