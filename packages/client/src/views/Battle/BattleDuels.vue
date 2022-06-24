<template>
  <div>
    <div v-for="item in items" :key="item.user.id">
      <div class="battle-unit-list">
        <BattleUnit
          v-for="unit in item.units"
          :key="unit.unitId"
          @click="unitClickHandler"
        />
      </div>
      <div>
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          @click="handleStart"
          >{{ $t("fight???") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>
<script>
import * as battle from "@/../../knightlands-shared/battle";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  components: {
    BattleUnit
  },
  data() {
    return {
      items: []
    };
  },
  async activated() {
    this.items = await this.$store.dispatch("battle/fetchDuelOptions");
  },
  methods: {
    unitClickHandler() {},
    handleStart() {
      this.$store.dispatch("battle/enterLevel", {
        room: this.$route.params.id,
        level: battle.GAME_DIFFICULTY_MEDIUM
      });
      this.$router.push({
        name: "battle-duels-play",
        params: { id: 123 }
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
