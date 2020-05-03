<template>
  <div v-bar>
    <div class="flex-full dummy-height">
      <div class="unit-items">
        <UnitItem @click="$emit('unitSelect', null)" />
        <UnitItem
          v-for="unit in units"
          :key="unit.id"
          :unit="unit"
          :active="unit == selectedUnit"
          @click="$emit('unitSelect', unit)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UnitItem from "./UnitItem.vue";

export default {
  props: ["isTroops", "selectedUnit"],
  components: { UnitItem },
  computed: {
    units() {
      return this.$game.army
        .getUnits(this.isTroops)
        .concat(this.$game.army.getUnits(this.isTroops))
        .concat(this.$game.army.getUnits(this.isTroops));
    }
  }
};
</script>

<style lang="less" scoped>
.unit-items {
  padding: 0.5rem;
  display: grid;
  justify-items: stretch;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 10rem;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
}
</style>
