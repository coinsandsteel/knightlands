<template>
  <div class="flex flex-center relative">
    <div class="chest-selector" v-for="(count, chest) in chests" :key="chest">
      <input :id="`chest${chest}`" type="radio" name="chest" :value="chest" v-model="selectedChest" />
      <label :for="`chest${chest}`" :class="`chest${chest}`">
        <div :class="{'selector-border': selectedChest==chest}"></div>
        <span class="chest-count font-size-20 digit-font">{{count}}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: ["chests", "value"],
  data: () => ({
    selectedChest: 0
  }),
  mounted() {
    this.selectedChest = this.value;
  },
  watch: {
    selectedChest() {
      this.$emit("input", this.selectedChest);
    },
    value() {
      this.selectedChest = this.value;
    }
  }
};
</script>

<style lang="less" scoped>
.chest-selector {
  display: inline-grid;

  & input {
    appearance: none;
    margin: 0;
    padding: 0;
  }

  & label {
    position: relative;
    transition: all 100ms ease-in;
    filter: brightness(1.8) grayscale(1) opacity(0.7);
  }

  & input:checked + label {
    filter: none;
  }
}

.selector-border {
  position: absolute;
  left: 0;
  top: 0;
  background: no-repeat url("../../assets/ui/difficulty_selected.png");
  background-size: contain;
  background-position: center;
  width: 100%;
  height: 100%;
}

.chest-count {
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
}

.chest-icon(@chest) {
  background: no-repeat url("./../../assets/ui/game_@{chest}.png");
  background-size: 80%;
  background-position: center;
  width: 8rem;
  height: 12rem;
  display: inline-block;
  cursor: pointer;

  &.disabled {
    opacity: 0.3;
  }
}

.chest0 {
  .chest-icon("chest1");
}

.chest1 {
  .chest-icon("chest2");
}

.chest2 {
  .chest-icon("chest3");
}

.chest3 {
  .chest-icon("chest4");
}

.chest4 {
  .chest-icon("chest5");
}
</style>

