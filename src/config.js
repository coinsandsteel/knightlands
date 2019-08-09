const Config = {
    "gameServerEndpoint": process.env.NODE_ENV == "production" ? "206.189.156.134" : "192.168.16.105",
    "gameServerPort": 9000,
    "httpEndpoint": process.env.NODE_ENV == "production" ? "http://206.189.156.134:9000" : "http://192.168.16.105:9000"
};

export default Config;