import { Outlet, Navigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useUserContext } from "../Context/Providers";

export const ProtectedRoute = () => {
  const { isLoading, isLoggedIn } = useUserContext();

  return isLoading ? (
    <CircularProgress />
  ) : isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
