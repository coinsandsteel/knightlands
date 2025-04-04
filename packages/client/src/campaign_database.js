import ZonesMeta from "@/metadata/zones_meta";
import RaidsMeta from "@/metadata/raids_meta";

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
    return `/images/enemies/${
      (ZonesMeta[zoneId] || {}).questsId[questIndex].image
    }.png`;
  },
  getRaidImage(raid) {
    return `/images/raids/${(RaidsMeta[raid] || {}).icon}.png`;
  },
  getRaidBackground(raid) {
    return `/images/raids/bg/${(RaidsMeta[raid] || {}).zoneImage}.jpg`;
  },
  getEnemyList(zoneId) {
    return ZonesMeta[+zoneId].questsId.map((_, idx) => idx);
  },
  isLastMission(zoneId, questIndex) {
    return ZonesMeta[+zoneId].questsId.length == +questIndex + 1;
  },
  getLastZone() {
    // include zone count in ZonesMeta
    return 40;
  }
};
