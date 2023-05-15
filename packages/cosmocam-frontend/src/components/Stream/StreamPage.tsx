import { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useProducerStream } from "../../hooks/stream";
import { VideoDeviceSelect } from "./VideoDeviceSelect";
import { useGetVideo } from "../../hooks/video";
import { Container } from "@mui/material";
import { useGetWindowSize } from "../../hooks/util";
import { StreamNameField } from "./StreamNameField";
import { Socket } from "socket.io-client";

interface StreamPageProps {
  socket: Socket;
  streaming: boolean;
}

export const StreamPage = ({ socket, streaming }: StreamPageProps) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>();
  const [activeDevice, setActiveDevice] = useState<string>("");

  const { windowHeight } = useGetWindowSize();

  const windowHeightAdjusted = windowHeight - 2 * 100;

  const { startStream, endStream } = useProducerStream({
    socket,
    streamRef,
    activeDevice,
  });

  const { getLocalStream } = useGetVideo({ deviceId: activeDevice });

  const streamSuccess = (stream: MediaStream) => {
    streamRef.current = stream;

    if (localVideo.current) {
      localVideo.current.srcObject = stream;
      localVideo.current.play();
    }

    socket.emit("streaming-socket-ready");

    if (streaming) startStream();
  };

  useEffect(() => {
    stopVideo();
    getLocalStream().then((stream) => streamSuccess(stream));
  }, [activeDevice]);

  useEffect(() => {
    if (streaming) {
      startStream();
    } else {
      endStream();
    }
  }, [streaming]);

  useEffect(() => {
    return () => stopVideo();
  }, []);

  const stopVideo = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={6}>
          <Container maxWidth="xs">
            <StreamNameField socket={socket} />
          </Container>
        </Grid>
        <Grid item xs={12} md={6}>
          <Container maxWidth="xs">
            <VideoDeviceSelect setActiveDevice={setActiveDevice} />
          </Container>
        </Grid>
        <Grid item xs={12}>
          <Container maxWidth="xl">
            <video
              height={`${windowHeightAdjusted}px`}
              width="100%"
              autoPlay
              loop
              playsInline
              muted
              ref={localVideo}
            ></video>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
