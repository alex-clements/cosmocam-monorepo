import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Headerbar } from "../Headerbar/Headerbar";
import { useAuthenticateToken } from "../../hooks/authentication";
import { ApplicationBar } from "../ApplicationBar/ApplicationBar";
import { useUserContext } from "../Context/Providers";
import { pathNames } from "@cosmocam/shared";
import { routes } from "./RoutesData";

export const ApplicationRoutes = () => {
  useAuthenticateToken();
  const { isLoggedIn } = useUserContext();

  return (
    <BrowserRouter>
      <Headerbar />
      {isLoggedIn && <ApplicationBar />}
      <Routes>
        <Route
          path={pathNames.LOGIN}
          element={routes[pathNames.LOGIN].element}
        />
        <Route
          path={pathNames.REGISTER}
          element={routes[pathNames.REGISTER].element}
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path={pathNames.DASHBOARD}
            element={routes[pathNames.DASHBOARD].element}
          />
          <Route
            path={pathNames.ACCOUNT}
            element={routes[pathNames.ACCOUNT].element}
          />
          <Route
            path={pathNames.STREAM}
            element={routes[pathNames.STREAM].element}
          />
          <Route
            path={pathNames.VIEW}
            element={routes[pathNames.VIEW].element}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
