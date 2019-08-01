export const Quests = {

};


const ZonesDatabase = {
    "1": {
        name: "Test Forest"
    },
    "2": {
        name: "Clouds and Mountains"
    }
};

export const Zones = {
    getName(zoneId) {
        return (ZonesDatabase[zoneId] || {}).name;
    },
    getBackground(zoneId) {
        return `/images/levels/level${zoneId}.png`;
    }
};