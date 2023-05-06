import { Button } from "@mui/material";
import { useRef } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useReceiverStream } from "../../hooks/stream";
import { useEffect, useState } from "react";
import { fetchActiveStreams } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

export const ViewStream = ({ goConsume, remoteVideoRef }) => {
  const [producerIds, setProducerIds] = useState<string[]>([]);
  const { token } = useUserContext();

  useEffect(() => {
    fetchActiveStreams({ token }).then((response) => {
      console.log(`producer ids: `, response.data.streams);
      setProducerIds(response.data.streams);
    });
  }, []);

  return (
    <>
      {producerIds.map((id) => (
        <Button onClick={() => goConsume(id)}>{id}</Button>
      ))}
      <Grid item xs={12}>
        <video autoPlay loop playsInline muted ref={remoteVideoRef}></video>
      </Grid>
    </>
  );
};
