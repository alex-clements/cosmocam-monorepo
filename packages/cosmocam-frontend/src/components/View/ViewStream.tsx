import { CircularProgress, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useFetchActiveStreams } from "../../hooks/stream";
import { useGetWindowSize } from "../../hooks/util";
import { ViewStreamEmptyState } from "./ViewStreamEmptyState";
import { SocketData } from "@cosmocam/shared";
import { ViewStreamButtons } from "./ViewStreamButtons";
import { Video } from "./Video";

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
    const { activeStreams, isLoading: isLoadingActiveStreams } =
      useFetchActiveStreams();

    const updateName = (socketId: string, name: string) => {
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

      if (socketId === selectedSocket?.socketId)
        setSelectedSocket({ socketId, socketName: name });
    };

    const updateSocketData = (socketId: string) => {
      let newProducerSockets: SocketData[] = [...producerSockets];
      let index = producerSockets.findIndex(
        (item) => item.socketId === socketId
      );
      if (index > -1) newProducerSockets.splice(index, 1);

      if (
        socketId === selectedSocket?.socketId &&
        newProducerSockets.length > 0
      )
        fetchProducerIdHandler(newProducerSockets[0]);

      setProducerSockets(newProducerSockets);
    };

    const addNewCamera = (socketId: string, name: string) => {
      let newProducerSockets: SocketData[] = [...producerSockets];
      let flag: boolean = false;
      for (let item of newProducerSockets)
        if (item.socketId === socketId) flag = true;
      if (!flag) newProducerSockets.push({ socketId, socketName: name });
      if (producerSockets.length === 0)
        fetchProducerIdHandler(newProducerSockets[0]);
      setProducerSockets(newProducerSockets);
    };

    const fetchProducerIdHandler = (item: SocketData) => {
      if (item.socketId !== selectedSocket?.socketId) {
        setSelectedSocket(item);
        fetchProducerId(item.socketId);
      }
    };

    useImperativeHandle(nameUpdateRef, () => {
      return {
        updateName,
        updateSocketData,
        addNewCamera,
      };
    });

    useEffect(() => {
      if (!isLoadingActiveStreams) {
        setProducerSockets(activeStreams);
        if (activeStreams.length > 0) {
          fetchProducerId(activeStreams[0].socketId);
          setSelectedSocket(activeStreams[0]);
        }
      }
    }, [isLoadingActiveStreams]);

    return isLoadingActiveStreams ? (
      <Container sx={{ paddingTop: "50px" }}>
        <CircularProgress />
      </Container>
    ) : producerSockets.length === 0 ? (
      <ViewStreamEmptyState />
    ) : (
      <>
        <Grid item xs={12} lg={3} order={{ xs: 2, lg: 1 }}>
          {/* <Box display={{ xs: "none", md: "block" }}> */}
          <ViewStreamButtons
            producerSockets={producerSockets}
            fetchProducerIdHandler={fetchProducerIdHandler}
          />
          {/* </Box> */}
        </Grid>
        <Grid item xs={12} lg={9} order={{ xs: 1, lg: 2 }}>
          <Video
            socketName={selectedSocket?.socketName}
            remoteVideoRef={remoteVideoRef}
            videoHeight={windowHeightAdjusted}
          />
        </Grid>
      </>
    );
  }
);
