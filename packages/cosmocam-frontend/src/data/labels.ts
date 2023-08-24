import { labels, RequiredLabels } from "@cosmocam/shared";

const englishLabels: RequiredLabels = {
  email: "email",
  password: "password",
  oldPassword: "old password",
  newPassword: "new Password",
  username: "username",
  login: "LOGIN",
  createAccount: "create account",
  dashboard: "dashboard",
  welcome: "welcome",
  capture: "stream",
  streamVideo: "stream video",
  watch: "watch",
  viewStreams: "view streams",
  account: "account",
  logout: "log out",
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
