<template>
  <div class="battle-unit-list">
    <BattleUnitListItem
      v-for="unit in units"
      :key="unit.id"
      :unit="unit"
      @click="clickHandler"
    />
    <slot />
  </div>
</template>
<script>
import BattleUnitListItem from "@/views/Battle/BattleUnitListItem.vue";

export default {
  components: {
    BattleUnitListItem
  },
  props: {
    units: Array,
    selectedUnits: Array,
    isSelectable: Boolean,
    isMultipleSelect: Boolean
  },
  data() {
    return {};
  },
  methods: {
    clickHandler(event) {
      this.$emit("click", event);
    }
  }
};
</script>
<style scoped lang="less">
// .battle-unit-list {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
//   justify-items: center;
//   row-gap: 0.5rem;
//   column-gap: 0.5rem;
// }
// .battle-unit {
//   width: 100%;
// }
</style>
