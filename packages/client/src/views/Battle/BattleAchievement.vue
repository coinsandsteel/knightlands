<template>
  <div class="font-size-22">
    <div>
      Collect Tier 3 squads and get access to achievements that unlock NFT
    </div>
    <div>
      <div v-for="item in items" :key="item.user.id" class="margin-bottom-4">
        <div>
          Name squad
        </div>
        <div class="battle-unit-list">
          <BattleUnit v-for="unit in item.units" :key="unit.id" />
        </div>
        <div>
          <CustomButton
            type="yellow"
            width="20rem"
            class="inline-block"
            @click="receiveHandler"
            >{{ $t("receive???") }}</CustomButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BattleUnit from "@/views/Battle/BattleUnit.vue";
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
        units: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
      result.push({
        user: { id: 2 },
        units: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
      result.push({
        user: { id: 3 },
        units: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
      return result;
    }
  },
  methods: {
    unitClickHandler() {},
    receiveHandler() {}
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
