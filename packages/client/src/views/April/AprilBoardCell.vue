<template>
  <div
    class="april-board-cell-container relative"
    :class="{ 'april-board-cell-container--black': index % 2 === 0 }"
  >
    <div class="april-board-cell absolute-stretch">
      <div
        v-if="isAvailableMove"
        class="april-board-cell-available-move absolute-stretch"
      />
      <div
        v-if="isHitZone"
        class="april-board-cell-hit-zone absolute-stretch"
      />
      <div
        v-if="isEnemy"
        class="april-board-cell-enemy april-board-cell-enemy--teeth absolute-stretch"
      />
      <div
        v-if="isHero"
        class="april-board-cell-hero april-board-cell-hero--knight absolute-stretch"
      />
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
    isHero() {
      return this.index === 22;
    },
    isEnemy() {
      return this.index === 7 || this.index === 17;
    },
    isAvailableMove() {
      return this.index === 12 || this.index === 13 || this.index === 17;
    },
    isHitZone() {
      return this.index === 17;
    }
  }
};
</script>
<style scoped lang="less">
.april-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  background: #fff;
}
.april-board-cell-container--black {
  background: #222;
}
.april-board-cell {
}
.april-board-cell-hit-zone {
  background: url("/images/april/hit_zone.svg") center/22% repeat;
}
.april-board-cell-available-move {
  background-color: rgba(#ef4444, 0.5);
}
.april-board-cell-enemy {
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-board-cell-hero {
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
