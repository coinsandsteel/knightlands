import ZonesMeta from "@/zones_meta";

export default {
    getZoneName(zoneId) {
        return (ZonesMeta[zoneId] || {}).name;
    },
    getMissionName(zoneId, questIndex) {
        return (ZonesMeta[zoneId] || {}).questsId[questIndex].name;
    },
    getBackground(zoneId) {
        return `/images/zones/${(ZonesMeta[zoneId] || {}).background}.jpg`;
    },
    getEnemyImage(zoneId, questIndex) {
        return `/images/enemies/${(ZonesMeta[zoneId] || {}).questsId[questIndex].image}.png`;
    }
};