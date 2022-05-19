<template>
  <div>
    <div>
      <div>
        Your army
      </div>
      <div class="battle-unit-list">
        <BattleUnit
          v-for="unit in units"
          :key="unit.id"
          @click="unitClickHandler"
        />
      </div>
    </div>
    <div>
      <div>
        Enemies
      </div>
      <div class="battle-enemy-unit-list">
        <BattleUnit v-for="unit in enemyUnits" :key="unit.id" />
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
import { create } from "vue-modal-dialogs";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
export default {
  components: {
    BattleUnit
  },
  data() {
    return {};
  },
  computed: {
    units() {
      return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    },
    enemyUnits() {
      return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    }
  },
  methods: {
    async unitClickHandler() {
      console.log("unitClickHandler");
      const showDailyRewardsDialog = create(BattleUnitSelect);
      await showDailyRewardsDialog();
    },
    handleStart() {
      this.$router.push({
        name: "battle-adventure-play",
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
.battle-enemy-unit-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(10rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
.battle-unit {
  width: 100%;
}
</style>
