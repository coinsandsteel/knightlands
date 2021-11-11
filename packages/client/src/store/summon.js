import Timer from "../timer";
import Vue from "vue";
import ArmySummonType from "@/../../knightlands-shared/army_summon_type";
import ArmySummonMeta from "@/army_summon_meta";

export default {
  namespaced: true,
  state: {
    basicSummon: { meta: ArmySummonMeta.normalSummon, lastSummon: 0 },
    advancedSummon: {
      meta: ArmySummonMeta.advancedSummon,
      lastSummon: 0
    }
  },
  mutations: {
    setAll(state, { info }) {
      state.basicSummon.lastSummon =
        info.lastSummon[ArmySummonType.Normal] || 0;

      state.advancedSummon.lastSummon =
        info.lastSummon[ArmySummonType.Advanced] || 0;
    }
  },
  actions: {
    async update(context) {
      const info = await Vue.prototype.$game.getArmySummonInfo();
      if (info) {
        context.commit("setAll", { info });
      }
    }
  }
};
