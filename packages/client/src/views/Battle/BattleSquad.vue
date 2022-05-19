<template>
  <div>
    Battle squad
    <div class="battle-unit-list">
      <BattleUnit
        v-for="unit in units"
        :key="unit.id"
        @click="unitClickHandler"
      />
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
    }
  },
  methods: {
    async unitClickHandler() {
      console.log("unitClickHandler");
      const showDailyRewardsDialog = create(BattleUnitSelect);
      await showDailyRewardsDialog();
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
.battle-unit {
  width: 100%;
}
</style>
