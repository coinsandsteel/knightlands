<template>
  <div>
    <div>
      <div class="font-size-22">
        Your army
      </div>
      <div class="battle-unit-list">
        <!-- <BattleUnit
          v-for="unit in units"
          :key="unit.unitId"
          @click="unitClickHandler"
        /> -->
        <BattleUnitList :units="units" />
      </div>
    </div>
    <div>
      <div class="font-size-22">
        Enemy 's army
      </div>
      <div class="battle-enemy-unit-list">
        <!-- <BattleUnit v-for="unit in enemyUnits" :key="unit.unitId" /> -->
        <BattleUnitList :units="enemyUnits" />
      </div>
    </div>
    <div class="text-align-center">
      <CustomButton
        type="yellow"
        width="20rem"
        class="inline-block"
        @click="handleStart"
        >{{ $t("start???") }}</CustomButton
      >
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
// import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
export default {
  components: {
    BattleUnitList
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game"]),
    units() {
      const result =
        this.game && this.game.userSquad && this.game.userSquad.units
          ? this.game.userSquad.units
          : [];

      const length = result.length;

      for (let i = 0; i < 5 - length; i++) {
        result.push(null);
      }

      return result;
    },
    enemyUnits() {
      const result =
        this.game && this.game.userSquad && this.game.userSquad.units
          ? this.game.userSquad.units
          : [];

      const length = result.length;

      for (let i = 0; i < 5 - length; i++) {
        result.push(null);
      }

      return result;
    }
  },
  methods: {
    async unitClickHandler() {
      const showDailyRewardsDialog = create(BattleUnitSelect);
      await showDailyRewardsDialog();
    },
    handleStart() {
      this.$store.dispatch("battle/enterLevel", {
        room: this.$route.params.id,
        level: null
      });
      this.$router.push({
        name: "battle-adventure-play",
        params: { unitId: this.$route.params.id }
      });
    }
  }
};
</script>
<style scoped lang="less">
// .battle-unit-list {
//   display: grid;
//   grid-template-columns: repeat(5, minmax(10rem, 1fr));
//   justify-items: center;
//   row-gap: 0.5rem;
//   column-gap: 0.5rem;
// }
// .battle-enemy-unit-list {
//   display: grid;
//   grid-template-columns: repeat(5, minmax(10rem, 1fr));
//   justify-items: center;
//   row-gap: 0.5rem;
//   column-gap: 0.5rem;
// }
// .battle-unit {
//   width: 100%;
// }
</style>
