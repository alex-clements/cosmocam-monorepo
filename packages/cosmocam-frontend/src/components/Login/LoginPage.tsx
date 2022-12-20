import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import Grid from "@mui/material/Grid";

interface LoginPageProps {}

export const LoginPage = ({}: LoginPageProps) => {
  return (
    <Fragment>
      <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={1}></Grid>
          <Grid item md={4} xs={10}>
            <LoginForm />
          </Grid>
          <Grid item md={4} xs={1}></Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};
