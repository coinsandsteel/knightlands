const Config = {
    "gameServerEndpoint": process.env.NODE_ENV == "production" ? "game.knightlands.com" : (process.env.VUE_APP_SAPPAO ? "sappao.knightlands.com" : "192.168.16.105"),
    "gameServerPort": 9000,
    "httpEndpoint": process.env.NODE_ENV == "production" ? "https://game.knightlands.com:9000" : (process.env.VUE_APP_SAPPAO ? "https://sappao.knightlands.com:9000": "http://192.168.16.105:9000")
};

export default Config;