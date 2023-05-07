import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { fetchActiveStreams } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

export const ViewStream = ({ goConsume, fetchProducerId, remoteVideoRef }) => {
  const [producerIds, setProducerIds] = useState<string[]>([]);
  const [producerSocketIds, setProducerSocketIds] = useState<string[]>([]);
  const { token } = useUserContext();

  useEffect(() => {
    fetchActiveStreams({ token }).then((response) => {
      console.log(`producer ids: `, response.data.streams);
      console.log("producer socket ids: ", response.data.sockets);
      setProducerIds(response.data.streams);
      setProducerSocketIds(response.data.sockets);
    });
  }, []);

  return (
    <>
      {/* <Grid item xs={12}>
        <h1>Producers</h1>
        {producerIds.map((id) => (
          <Button variant="contained" onClick={() => goConsume(id)}>
            {id}
          </Button>
        ))}
      </Grid> */}
      <Grid item xs={12}>
        <h1>Sockets</h1>
        {producerSocketIds.map((id) => (
          <Button variant="contained" onClick={() => fetchProducerId(id)}>
            {id}
          </Button>
        ))}
      </Grid>

      <Grid item xs={12}>
        <video
          height="240px"
          autoPlay
          loop
          playsInline
          muted
          controls
          ref={remoteVideoRef}
        ></video>
      </Grid>
    </>
  );
};
