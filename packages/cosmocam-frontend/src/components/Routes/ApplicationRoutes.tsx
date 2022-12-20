import { LoginPage } from "../Login/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RegisterPage } from "../Register/RegisterPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import { Dashboard } from "../Dashboard/Dashboard";
import { Headerbar } from "../Headerbar/Headerbar";
import { useAuthenticateToken } from "../../hooks/authentication";
import { AccountPage } from "../Account/AccountPage";
import { StreamPage } from "../Stream/StreamPage";
import { ViewPage } from "../View/ViewPage";

export const ApplicationRoutes = () => {
  useAuthenticateToken();

  return (
    <BrowserRouter>
      <Headerbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/stream" element={<StreamPage />} />
          <Route path="/view" element={<ViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
