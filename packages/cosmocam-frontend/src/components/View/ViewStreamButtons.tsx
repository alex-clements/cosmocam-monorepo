import { SocketData } from "@cosmocam/shared";
import { Button, Container, Stack, Typography } from "@mui/material";

interface ViewStreamButtonsProps {
  producerSockets: SocketData[];
  fetchProducerIdHandler: (item: SocketData) => void;
}

export const ViewStreamButtons = ({
  producerSockets,
  fetchProducerIdHandler,
}: ViewStreamButtonsProps) => {
  return (
    <Container maxWidth="xs">
      <Stack spacing={2}>
        <Typography variant="h6" color="white" component="div">
          Available Cameras
        </Typography>
        {producerSockets.map((item: SocketData) => (
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
  );
};
