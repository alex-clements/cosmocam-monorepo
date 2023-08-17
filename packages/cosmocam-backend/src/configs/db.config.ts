export const dburi =
  process.env.NODE_ENV == "production"
    ? "mongodb://db:27017/test"
    : "mongodb://localhost:2717/test";
