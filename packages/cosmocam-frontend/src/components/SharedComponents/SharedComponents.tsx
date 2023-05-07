import { FormControl, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
      color: "white",
    },
  },
});

export const CssFormControl = styled(FormControl)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white",
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
      color: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
      color: "white",
    },
    "& .Mui-focused fieldset": {
      borderColor: "white",
      color: "white",
    },
    "& .MuiFormLabel-root": {
      color: "white",
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiFormControl-root": {
      color: "white",
    },
    "& MuiSvgIcon-root": {
      color: "white",
    },
  },
});
