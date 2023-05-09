import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import { CssFormControl } from "../SharedComponents/SharedComponents";
import { useGetMediaDevices } from "../../hooks/stream";

export const VideoDeviceSelect = ({ setActiveDevice }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const { mediaDevices, isLoading: isLoadingMediaDevices } =
    useGetMediaDevices();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedDevice(event.target.value as string);
    setActiveDevice(event.target.value as string);
  };

  useEffect(() => {
    if (
      !isLoadingMediaDevices &&
      mediaDevices.length > 0 &&
      selectedDevice === ""
    ) {
      setSelectedDevice(mediaDevices[0].deviceId);
    }
  }, [mediaDevices, isLoadingMediaDevices]);

  return (
    <Fragment>
      {mediaDevices.length !== 0 && (
        <CssFormControl fullWidth>
          <InputLabel id="device-select-label" sx={{ color: "white" }}>
            Device
          </InputLabel>
          <Select
            labelId="device-select-label"
            id="device-select"
            value={selectedDevice}
            label="Device"
            onChange={handleChange}
            sx={{ borderColor: "white", color: "white" }}
          >
            {mediaDevices?.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </CssFormControl>
      )}
    </Fragment>
  );
};
