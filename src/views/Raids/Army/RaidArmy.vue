<template>
  <div class="raid-army-root full-flex flex flex-center" v-resize="onResize">
    <div class="unit-grid width-100 height-100" ref="grid">
      <RaidArmySlot v-for="slot in generals" :key="slot.id" :unit="slot.unit" />
      <RaidArmySlot v-for="slot in troops" :key="slot.id" :unit="slot.unit" />
    </div>
  </div>
</template>

<script>
import RaidArmySlot from "./RaidArmySlot.vue";
import resize from "vue-resize-directive";

export default {
  props: ["legionIndex"],
  components: { RaidArmySlot },
  directives: {
    resize
  },
  watch: {
    legionIndex: {
      immediate: true,
      handler() {
        this.reload();
      }
    }
  },
  computed: {
    generals() {
      return this.$game.army.getSlots(this.legionIndex, false);
    },
    troops() {
      return this.$game.army.getSlots(this.legionIndex, true);
    }
  },
  methods: {
    onResize() {
      // make it square
      let minDimension = Math.min(
        this.$refs.grid.offsetHeight,
        this.$refs.grid.offsetWidth
      );

      this.$refs.grid.style.width = minDimension + "px";
      this.$refs.grid.style.height = minDimension + "px";
    },
    reload() {}
  }
};
</script>

<style lang="less" scoped>
.unit-grid {
  display: grid;
  grid-template-rows: 33% 33% 33%;
  // grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: 33% 33% 33%;
}

// .outer {
//   position: relative;

//   &:before {
//     display: block;
//     content: "";
//     width: 100%;
//     padding-top: 100%;
//   }

//   & > .inner {
//     position: absolute;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     left: 0;
//   }
// }
</style>
