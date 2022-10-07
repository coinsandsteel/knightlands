<template>
  <div class="battle-unit-list">
    <BattleUnitListItem
      v-for="(unit, index) in units"
      :key="index + '_' + (unit ? unit.unitId : '')"
      :unit="unit"
      :isQuantityVisible="isQuantityVisible"
      @click="clickHandler(unit, index)"
    >
      <div
        v-if="isClearButtonVisible"
        class="flex-full flex flex-justify-end flex-items-center padding-left-6"
      >
        <CloseButton @click="clearHandler($event, unit, index)"></CloseButton>
      </div>
    </BattleUnitListItem>
    <slot />
  </div>
</template>
<script>
import BattleUnitListItem from "@/views/Battle/BattleUnitListItem.vue";
import CloseButton from "@/components/CloseButton.vue";

export default {
  components: {
    BattleUnitListItem,
    CloseButton
  },
  props: {
    units: Array,
    selectedUnits: Array,
    isSelectable: Boolean,
    isQuantityVisible: Boolean,
    isMultipleSelect: Boolean,
    isClearButtonVisible: Boolean
  },
  data() {
    return {};
  },
  methods: {
    clickHandler(unit, index) {
      this.$emit("click", { unit, index });
    },
    clearHandler(event, unit, index) {
      event.stopPropagation();
      this.$emit("clear", { unit, index });
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
.close-btn {
  position: relative;
  top: unset;
  right: unset;
}
</style>
