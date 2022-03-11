<template>
  <div class="april-card-container">
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
      return -Math.ceil(
        (this.totalCards + (this.totalCards % 2) === 0) / 2 - (this.index + 1)
      );
    }
    // absoluteIndexFromCenter() {
    //   return Math.abs(Math.ceil(this.totalCards / 2 - (this.index + 1)));
    // }
  }
};
</script>
<style scoped lang="less">
.april-card-container {
  margin-left: calc(var(--base-size) / -5);
}
.april-card {
  width: var(--base-size);
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
