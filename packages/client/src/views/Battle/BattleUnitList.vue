<template>
  <div class="battle-unit-list">
    <BattleUnit v-for="unit in units" :key="unit.id" @click="clickHandler" />
    <slot />
  </div>
</template>
<script>
import BattleUnit from "@/views/Battle/BattleUnit.vue";

export default {
  components: {
    BattleUnit
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
<style scoped lang="scss">
.battle-unit-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
.battle-unit {
  width: 100%;
}
</style>
