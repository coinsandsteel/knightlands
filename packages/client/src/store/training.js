import Vue from "vue";
import UpgradableCharacterStats from "@/../../knightlands-shared/upgradable_character_stats";
import TrainingCamp from "@/../../knightlands-shared/training_camp";
import { StatConversions } from "@/../../knightlands-shared/character_stat";
import TrainingCampMeta from "@/metadata/training_camp";

function getMaxStatValue(stat) {
  return (
    TrainingCamp.getMaxStat(Vue.prototype.$character.level) *
    StatConversions[stat]
  );
}

function getStatValue(stat) {
  return getAttributeValue(stat) * StatConversions[stat];
}

function getResource(stat) {
  return {
    itemId: TrainingCampMeta.find(x => x.stat == stat).resource,
    quantity: TrainingCamp.getStatResourceCost(stat, getAttributeValue(stat))
  };
}

function hasEnoughResource(resourceItems, stat) {
  const res = getResource(stat);
  return resourceItems[stat] && resourceItems[stat].count >= res.quantity;
}

function canTrainMore(stat) {
  const statValue = getStatValue(stat);
  const maxStatValue = getMaxStatValue(stat);

  return statValue < maxStatValue;
}

function getAttributeValue(stat) {
  return Vue.prototype.$character.getAttribute(stat);
}

function hasEnoughGold(stat) {
  return (
    TrainingCamp.getStatCost(stat, getAttributeValue(stat)) <=
    Vue.prototype.$game.softCurrency
  );
}

export default {
  namespaced: true,
  state: {
    anyStatCanBeTrained: false
  },
  mutations: {
    setAll(state, anyStatCanBeTrained) {
      state.anyStatCanBeTrained = anyStatCanBeTrained;
    }
  },
  actions: {
    async update(context) {
      let anyStatCanBeTrained = false;
      const resourceItems = {};
      for (let statKey in UpgradableCharacterStats) {
        const stat = UpgradableCharacterStats[statKey];

        resourceItems[stat] = Vue.prototype.$game.inventory.getItemByTemplate(
          TrainingCampMeta.find(x => x.stat == stat).resource
        );

        if (
          hasEnoughResource(resourceItems, stat) &&
          hasEnoughGold(stat) &&
          canTrainMore(stat)
        ) {
          anyStatCanBeTrained = true;
          break;
        }
      }

      context.commit("setAll", anyStatCanBeTrained);
    }
  }
};
