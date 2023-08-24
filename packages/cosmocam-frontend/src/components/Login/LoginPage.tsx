import React, { Fragment, useEffect } from "react";
import LoginForm from "./LoginForm";
import LoginHeading from "./LoginHeading";
import { useUserContext } from "../Context/Providers";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

interface LoginPageProps {}

export const LoginPage = ({}: LoginPageProps) => {
  const { isLoading, isLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

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
        <Box sx={{ paddingTop: matches ? 5 : 1, flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item lg={7} md={6} xs={12}>
              <Container sx={{ paddingY: matches ? 5 : 0 }}>
                <LoginHeading />
              </Container>
            </Grid>
            <Grid item lg={3} md={4} xs={12}>
              <Container sx={{ paddingY: matches ? 5 : 3 }} maxWidth="xs">
                <LoginForm />
              </Container>
            </Grid>
          </Grid>
        </Box>
      )}
    </Fragment>
  );
};
