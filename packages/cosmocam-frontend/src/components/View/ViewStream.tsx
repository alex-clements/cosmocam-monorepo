import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
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
      <Grid item xs={12}>
        {producerIds.map((id) => (
          <Button variant="contained" onClick={() => goConsume(id)}>
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
