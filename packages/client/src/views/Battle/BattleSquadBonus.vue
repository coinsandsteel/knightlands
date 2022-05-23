<template>
  <div class="font-size-22">
    <div>
      <div v-for="item in items" :key="item.user.id" class="margin-bottom-4">
        <div>
          Name
        </div>
        <div class="battle-unit-list">
          <BattleUnit v-for="unit in item.units" :key="unit.unitId" />
        </div>
        <div>
          <CustomButton
            type="yellow"
            width="20rem"
            class="inline-block"
            @click="showDetailsHandler"
            >{{ $t("???") }}</CustomButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleSquadBonusDetails from "@/views/Battle/BattleSquadBonusDetails.vue";
export default {
  components: {
    BattleUnit
  },
  data() {
    return {};
  },
  computed: {
    items() {
      const result = [];
      result.push({
        user: { id: 1 },
        units: [
          { unitId: 1 },
          { unitId: 2 },
          { unitId: 3 },
          { unitId: 4 },
          { unitId: 5 }
        ]
      });
      result.push({
        user: { id: 2 },
        units: [
          { unitId: 1 },
          { unitId: 2 },
          { unitId: 3 },
          { unitId: 4 },
          { unitId: 5 }
        ]
      });
      result.push({
        user: { id: 3 },
        units: [
          { unitId: 1 },
          { unitId: 2 },
          { unitId: 3 },
          { unitId: 4 },
          { unitId: 5 }
        ]
      });
      return result;
    }
  },
  methods: {
    unitClickHandler() {},
    async showDetailsHandler() {
      const show = create(BattleSquadBonusDetails);
      await show();
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
