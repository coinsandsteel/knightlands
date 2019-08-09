const Config = {
    "gameServerEndpoint": process.env.ENV == "prod" ? "game.knightlands.com" : "192.168.16.105",
    "gameServerPort": 9000,
    "httpEndpoint": process.env.ENV == "prod" ? "https://game.knightlands.com:9000" : "http://192.168.16.105:9000"
};

export default Config;