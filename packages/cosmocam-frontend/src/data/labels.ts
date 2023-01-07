import { labels, RequiredLabels } from "@cosmocam/shared";

const englishLabels: RequiredLabels = {
  email: "email",
  password: "password",
  oldPassword: "old password",
  newPassword: "new Password",
  username: "username",
  login: "LOGIN",
  createAccount: "Create Account",
  dashboard: "Dashboard",
  welcome: "Welcome",
  capture: "Capture",
  streamVideo: "Stream Video",
  watch: "Watch",
  viewStreams: "View Streams",
  account: "Account",
  logout: "Log Out",
};

const supportedLanguages = {
  en: englishLabels,
};

const getPreferredLanguage = (): string => {
  let currLang = navigator.language;
  currLang = currLang.toLowerCase();
  currLang = currLang === "en-us" ? "en" : currLang;
  return supportedLanguages.hasOwnProperty(currLang)
    ? currLang.toLowerCase()
    : "en";
};

const generateGetPreferredLanguageCached = () => {
  let preferredLanguage: string;

  return function () {
    if (preferredLanguage) {
      return preferredLanguage;
    } else {
      const preferredLanguage = getPreferredLanguage();
      return preferredLanguage;
    }
  };
};

const getPreferredLanguageCached: () => string =
  generateGetPreferredLanguageCached();

export const getLabel = (label: labels) => {
  const preferredLanguage = getPreferredLanguageCached();
  return supportedLanguages[preferredLanguage][label];
};
