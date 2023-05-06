import React, { Fragment, useEffect } from "react";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import Grid from "@mui/material/Grid";
import { useUserContext } from "../Context/Providers";

import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

interface LoginPageProps {}

export const LoginPage = ({}: LoginPageProps) => {
  const { isLoading, isLoggedIn } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn]);

  return (
    <Fragment>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={4} xs={1}></Grid>
            <Grid item md={4} xs={10}>
              <LoginForm />
            </Grid>
            <Grid item md={4} xs={1}></Grid>
          </Grid>
        </Box>
      )}
    </Fragment>
  );
};
