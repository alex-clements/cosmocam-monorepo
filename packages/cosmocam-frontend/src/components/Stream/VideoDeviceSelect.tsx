import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState, Fragment } from "react";
import { CssFormControl } from "../SharedComponents/SharedComponents";

export const VideoDeviceSelect = ({ setActiveDevice }) => {
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    let newDeviceList: any[] = [];
    devices.forEach((device) => {
      if (device.kind === "videoinput") newDeviceList.push(device);
    });
    setDeviceList(newDeviceList);
  });

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedDevice(event.target.value as string);
    setActiveDevice(event.target.value as string);
  };

  return (
    <Fragment>
      {deviceList.length !== 0 && (
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
            {deviceList?.map((device) => (
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
