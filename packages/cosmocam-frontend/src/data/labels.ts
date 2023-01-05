export const supportedLanguages = ["en"];

export const getPreferredLanguage = () => {
  let currLang = navigator.language;
  currLang = currLang.toLowerCase();
  if (currLang === "en-us") {
    currLang = "en";
  }
  if (supportedLanguages.includes(currLang)) {
    return currLang.toLowerCase();
  } else {
    return "en";
  }
};

export const labels = {
  email: { en: "email" },
  password: { en: "password" },
  login: { en: "LOGIN" },
  createAccount: { en: "Create Account" },
  dashboard: { en: "Dashboard" },
  welcome: { en: "Welcome" },
  capture: { en: "Capture" },
  streamVideo: { en: "Stream Video" },
  watch: { en: "Watch" },
  viewStreams: { en: "View Streams" },
  account: { en: "Account" },
  logout: { en: "Log Out" },
};
