import { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useProducerStream } from "../../hooks/stream";
import { VideoDeviceSelect } from "./VideoDeviceSelect";
import { useGetVideo } from "../../hooks/video";

export const StreamPage = ({ socket, streaming }) => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream>();
  const [activeDevice, setActiveDevice] = useState<string>("");
  console.log("streaming: ", streaming);

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
        <Grid item xs={12} sm={5}></Grid>
        <Grid item xs={12} sm={2}>
          <VideoDeviceSelect setActiveDevice={setActiveDevice} />
        </Grid>
        <Grid item xs={12} sm={5}></Grid>
      </Grid>
    </Box>
  );
};
