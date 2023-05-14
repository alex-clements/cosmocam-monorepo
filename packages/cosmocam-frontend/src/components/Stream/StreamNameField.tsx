import { Socket } from "socket.io-client";
import { CssTextField } from "../SharedComponents/SharedComponents";
import { useState } from "react";

interface StreamNameFieldProps {
  socket: Socket | undefined;
}

export const StreamNameField = ({ socket }: StreamNameFieldProps) => {
  const [streamName, setStreamName] = useState<string>("");

  const handleChange = (e) => {
    setStreamName(e.target.value);
    socket?.emit("name-update", { name: e.target.value });
  };

  return (
    <CssTextField
      id="outlined-basic"
      label="Stream Name"
      variant="outlined"
      value={streamName}
      onChange={handleChange}
      color="primary"
      sx={{ input: { color: "white" } }}
      InputLabelProps={{
        style: { color: "white" },
      }}
      fullWidth
    />
  );
};
