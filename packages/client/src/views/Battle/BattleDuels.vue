<template>
  <div class="padding-left-2 padding-right-2">
    <div class="text-align-center font-size-22 margin-top-2">
      <div>PVP Score: {{ pvpScore }}</div>
      <div>Duels Left: {{ duelsLeft }}</div>
    </div>
    <div
      v-for="(units, difficulty) in items"
      :key="'option_' + difficulty"
      class="margin-top-2"
    >
      <div class=" font-size-22">
        {{ $t("battle-duels-" + difficulty) }}
      </div>
      <div class="battle-unit-list margin-top-1">
        <BattleUnit
          v-for="unit in units"
          :key="unit.unitId"
          :unit="unit"
          @click="unitClickHandler"
        />
      </div>
      <div class="margin-top-1 flex flex-column flex-no-wrap flex-center">
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          :disabled="!isFightersFullFilled || !(duelsLeft > 0)"
          @click="handleStart(difficulty)"
          >Fight</CustomButton
        >
        <div
          v-if="!isFightersFullFilled"
          class="font-size-18 font-shadow rarity-mythical"
        >
          You need to build a squad
        </div>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="isActive">
      <template v-if="true">
        <CustomButton v-if="false" type="blue" @click="resetDuelsCounterHandler"
          >Reset Duels Counter</CustomButton
        >
      </template>
    </portal>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";
import { getCurrentDateString } from "@/helpers/utils";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
// import * as battle from "@/../../knightlands-shared/battle";
import AppSection from "@/AppSection.vue";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    BattleUnit
  },
  data() {
    return {
      items: []
    };
  },
  computed: {
    ...mapGetters("battle", ["isFightersFullFilled"]),
    ...mapState("battle", ["user"]),
    pvpScore() {
      return this.user.pvpScore || 0;
    },
    duelsLeft() {
      const dateString = getCurrentDateString();

      const doneDuelsCount =
        this.user.counters &&
        this.user.counters.duels &&
        this.user.counters.duels[dateString]
          ? this.user.counters.duels[dateString] || 0
          : 0;

      return battle.BATTLE_MAX_DUELS_DAILY - doneDuelsCount;
    }
  },
  async activated() {
    this.title = this.$t("Duels");
    this.items = await this.$store.dispatch("battle/fetchDuelOptions");
  },
  methods: {
    unitClickHandler() {},
    async handleStart(difficulty) {
      await this.performRequestNoCatch(
        this.$store.dispatch("battle/enterDuel", { difficulty })
      );
      this.$nextTick(() => {
        this.$router.push({
          name: "battle-duels-play"
        });
      });
    },
    resetDuelsCounterHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "resetDuelsCounter"
      });
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(10rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
// .battle-enemy-unit-list {
//   display: grid;
//   grid-template-columns: repeat(5, minmax(10rem, 1fr));
//   justify-items: center;
//   row-gap: 0.5rem;
//   column-gap: 0.5rem;
// }
.battle-unit {
  width: 100%;
}
</style>
