const config =
  process.env.NODE_ENV === "development"
    ? require("./config.dev.json")
    : require("./config.json");

export default config;
