import * as React from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import { ToastType } from "@cosmocam/shared";

export interface State extends SnackbarOrigin {
  open: boolean;
  message: string;
}

export interface ToastProps {
  messageProp: string;
  openProp: boolean;
  typeProp: ToastType;
}

export const Toast = ({ messageProp, openProp, typeProp }: ToastProps) => {
  const [state, setState] = React.useState<State>({
    open: false,
    message: "",
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open, message } = state;

  React.useEffect(() => {
    if (openProp) {
      setState({ ...state, open: true, message: messageProp });
    } else {
      setState({ ...state, open: false, message: messageProp });
    }
  }, [openProp, messageProp]);

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
      >
        {typeProp === "info" ? (
          <Alert variant="filled" severity="success" color="info">
            {message}
          </Alert>
        ) : (
          <Alert variant="filled" severity="error" color="info">
            {message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};
