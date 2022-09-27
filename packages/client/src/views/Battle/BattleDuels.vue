<template>
  <div>
    <div
      v-for="(units, index) in items"
      :key="'option_' + index"
      :class="index > 0 ? 'margin-top-4' : 'margin-top-2'"
    >
      <div class="battle-unit-list">
        <BattleUnit
          v-for="unit in units"
          :key="unit.unitId"
          :unit="unit"
          @click="unitClickHandler"
        />
      </div>
      <div class="margin-top-1">
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          :disabled="!isFightersFullFilled"
          @click="handleStart(index)"
          >Fight</CustomButton
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import * as battle from "@/../../knightlands-shared/battle";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  mixins: [NetworkRequestErrorMixin],
  components: {
    BattleUnit
  },
  data() {
    return {
      items: []
    };
  },
  computed: {
    ...mapGetters("battle", ["isFightersFullFilled"])
  },
  async activated() {
    this.items = await this.$store.dispatch("battle/fetchDuelOptions");
  },
  methods: {
    unitClickHandler() {},
    async handleStart(index) {
      const options = [
        battle.GAME_DIFFICULTY_LOW,
        battle.GAME_DIFFICULTY_MEDIUM,
        battle.GAME_DIFFICULTY_HIGH
      ];
      await this.performRequestNoCatch(
        this.$store.dispatch("battle/enterDuel", {
          difficulty: options[index]
        })
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
