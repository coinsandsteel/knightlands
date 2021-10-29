const Config = {
  gameServerEndpoint:
    process.env.NODE_ENV == "production"
      ? "play.knightlands.com"
      : process.env.VUE_APP_SAPPAO
      ? "test.knightlands.com"
      : "localhost",
  gameServerPort: 9000,
  httpEndpoint:
    process.env.NODE_ENV == "production"
      ? "https://play.knightlands.com:9000"
      : process.env.VUE_APP_SAPPAO
      ? "https://test.knightlands.com:9000"
      : "http://localhost:9000"
};

export default Config;
