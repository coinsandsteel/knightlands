<template>
  <div class="battle-board-cell-container relative" @click="clickHandler">
    <div class="april-board-cell absolute-stretch">
      <!-- unit -->
      <div
        v-if="isUnit"
        class="battle-board-cell-unit-wrapper absolute-stretch"
      >
        <div class="battle-board-cell-unit absolute-stretch"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    index: Number
    // card: Object
  },
  data() {
    return {};
  },
  computed: {
    isUnit() {
      return this.index < 5 || this.index >= 35;
    }
  },
  methods: {
    clickHandler() {}
  }
};
</script>
<style scoped lang="scss">
.battle-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  background: #ccc;
  border: 1px solid #666;
}
.battle-board-cell-unit {
  background: url("/images/battle/unit.png") center/80% no-repeat;
}
</style>
