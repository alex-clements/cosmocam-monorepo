import { Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { fetchActiveStreams } from "../../services/socket";
import { useUserContext } from "../Context/Providers";

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
  const [producerSocketIds, setProducerSocketIds] = useState<string[]>([]);
  const { token } = useUserContext();

  useEffect(() => {
    fetchActiveStreams({ token }).then((response) => {
      setProducerSocketIds(response.data.sockets);
    });
  }, []);

  return (
    <>
      <Grid item xs={12}>
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
