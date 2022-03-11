<template>
  <div
    class="april-card-container"
    :style="{
      'margin-left': marginLeft,
      'margin-right': marginRight,
      transform: `rotate(${rotate}deg) translateY(${transformY}px)`
    }"
  >
    <div class="april-card-wrapper">
      <div class="april-card relative" :class="`april-card--${card.cardClass}`">
        <div
          class="april-card-background absolute-stretch"
          :class="`april-card-background--${card.cardClass}`"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    card: Object,
    index: Number,
    totalCards: Number
  },
  data() {
    return {};
  },
  computed: {
    indexFromCenter() {
      const index = Math.ceil(this.index - this.totalCards / 2);
      if (this.totalCards % 2) {
        return index;
      } else {
        return index >= 0 ? index + 1 : index;
      }
    },
    absoluteIndexFromCenter() {
      return Math.abs(this.indexFromCenter);
    },
    marginLeft() {
      return this.indexFromCenter > 0
        ? this.totalCards % 2
          ? `calc(-1/4 * var(--base-size))`
          : `calc(-1/8 * var(--base-size))`
        : undefined;
    },
    marginRight() {
      return this.indexFromCenter < 0
        ? this.totalCards % 2
          ? `calc(-1/4 * var(--base-size))`
          : `calc(-1/8 * var(--base-size))`
        : undefined;
    },
    rotate() {
      // return this.indexFromCenter * 3;
      return 0;
    },
    transformY() {
      // return -3 * (this.totalCards / 2 - this.absoluteIndexFromCenter);
      return 0;
    }
  }
};
</script>
<style scoped lang="less">
.april-card-container {
  // margin-left: calc(var(--base-size) / -5);
}
.april-card-wrapper {
  width: var(--base-size);
}
.april-card {
  width: 100%;
  padding-bottom: 150%;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #eee;
}
.april-card-background {
  border-radius: 6px;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
