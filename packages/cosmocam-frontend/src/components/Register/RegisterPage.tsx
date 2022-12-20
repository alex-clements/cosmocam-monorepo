import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import { RegisterForm } from "./RegisterForm";
import Grid from "@mui/material/Grid";

interface RegisterPageProps {}

export const RegisterPage = ({}: RegisterPageProps) => {
  return (
    <Fragment>
      <Box sx={{ paddingTop: 5, flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item md={4} xs={1}></Grid>
          <Grid item md={4} xs={10}>
            <RegisterForm />
          </Grid>
          <Grid item md={4} xs={1}></Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};
