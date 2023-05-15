import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useFetchActiveStreams } from "../../hooks/stream";
import { useGetWindowSize } from "../../hooks/util";
import { ViewStreamEmptyState } from "./ViewStreamEmptyState";
import { SocketData } from "@cosmocam/shared";

interface ViewStreamProps {
  goConsume: any;
  fetchProducerId: any;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
}

export const ViewStream = forwardRef(
  (
    { goConsume, fetchProducerId, remoteVideoRef }: ViewStreamProps,
    nameUpdateRef
  ) => {
    const [selectedSocket, setSelectedSocket] = useState<SocketData>();
    const [producerSockets, setProducerSockets] = useState<SocketData[]>([]);

    const { windowHeight } = useGetWindowSize();

    const windowHeightAdjusted = windowHeight - 2 * 100;

    useImperativeHandle(nameUpdateRef, () => {
      return {
        updateName: (socketId: string, name: string) => {
          let currentProducerSockets: SocketData[] = [];

          for (let item of producerSockets) {
            if (item.socketId === socketId) {
              currentProducerSockets.push({
                socketId: socketId,
                socketName: name,
              });
            } else {
              currentProducerSockets.push(item);
            }
          }
          setProducerSockets(currentProducerSockets);

          if (socketId === selectedSocket?.socketId) {
            let newSelectedSocket = { socketId, socketName: name };
            setSelectedSocket(newSelectedSocket);
          }
        },
        updateSocketData: (socketId: string) => {
          let newProducerSockets: SocketData[] = [...producerSockets];
          let index = producerSockets.findIndex(
            (item) => item.socketId === socketId
          );
          if (index > -1) {
            newProducerSockets.splice(index, 1);
          }

          if (
            socketId === selectedSocket?.socketId &&
            newProducerSockets.length > 0
          ) {
            fetchProducerIdHandler(newProducerSockets[0]);
          }

          setProducerSockets(newProducerSockets);
        },
        addNewCamera: (socketId: string, name: string) => {
          let newProducerSockets: SocketData[] = [...producerSockets];
          let flag: boolean = false;
          for (let item of newProducerSockets) {
            if (item.socketId === socketId) {
              flag = true;
            }
          }

          if (!flag) {
            newProducerSockets.push({ socketId, socketName: name });
          }

          if (producerSockets.length === 0) {
            fetchProducerIdHandler(newProducerSockets[0]);
          }
          setProducerSockets(newProducerSockets);
        },
      };
    });

    const { activeStreams, isLoading: isLoadingActiveStreams } =
      useFetchActiveStreams();

    useEffect(() => {
      if (!isLoadingActiveStreams) {
        setProducerSockets(activeStreams);
        if (activeStreams.length > 0) {
          fetchProducerId(activeStreams[0].socketId);
          setSelectedSocket(activeStreams[0]);
        }
      }
    }, [isLoadingActiveStreams]);

    const fetchProducerIdHandler = (item) => {
      if (item.socketId !== selectedSocket?.socketId) {
        setSelectedSocket(item);
        fetchProducerId(item.socketId);
      }
    };

    return isLoadingActiveStreams ? (
      <CircularProgress />
    ) : producerSockets.length === 0 ? (
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
              {producerSockets.map((item) => (
                <Button
                  key={item.socketId}
                  variant="contained"
                  onClick={() => fetchProducerIdHandler(item)}
                >
                  {item.socketName}
                </Button>
              ))}
            </Stack>
          </Container>
          {/* </Box> */}
        </Grid>
        <Grid item xs={12} lg={9} order={{ xs: 1, lg: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" color="white" component="div">
              Currently Watching {selectedSocket?.socketName}
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
  }
);
