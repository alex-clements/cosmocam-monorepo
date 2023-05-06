import { pathNames, pageNames } from "@cosmocam/shared";
import { LoginPage } from "../Login/LoginPage";
import { RegisterPage } from "../Register/RegisterPage";
import { Dashboard } from "../Dashboard/Dashboard";
import { AccountPage } from "../Account/AccountPage";
import { StreamPageWrapper } from "../Stream/StreamPageWrapper";
import { ViewPageWrapper } from "../View/ViewPageWrapper";

export const routes = {
  [pathNames.LOGIN]: { element: <LoginPage />, pagename: pageNames.LOGIN },
  [pathNames.REGISTER]: {
    element: <RegisterPage />,
    pagename: pageNames.REGISTER,
  },
  [pathNames.DASHBOARD]: {
    element: <Dashboard />,
    pagename: pageNames.DASHBOARD,
  },
  [pathNames.ACCOUNT]: {
    element: <AccountPage />,
    pagename: pageNames.ACCOUNT,
  },
  [pathNames.STREAM]: {
    element: <StreamPageWrapper />,
    pagename: pageNames.STREAM,
  },
  [pathNames.VIEW]: { element: <ViewPageWrapper />, pagename: pageNames.VIEW },
};
