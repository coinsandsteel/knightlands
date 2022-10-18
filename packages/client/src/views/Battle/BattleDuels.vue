<template>
  <div class="padding-left-2 padding-right-2">
    <div class="text-align-center font-size-22 margin-top-2">
      PVP Score: {{ pvpScore }}
    </div>
    <div
      v-for="(units, difficulty) in items"
      :key="'option_' + difficulty"
      :class="difficulty !== 'low' ? 'margin-top-4' : 'margin-top-2'"
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
          :disabled="!isFightersFullFilled"
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
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
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
