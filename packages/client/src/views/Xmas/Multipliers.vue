<template>
  <div class="multipliers flex flex-column">
    <a
      class="multiplier font-size-25"
      :class="[levelGap === data.value ? 'active' : '']"
      v-for="(data, id) in multipliers"
      :key="'multiplier' + id"
      @click="handleClick(data.value)"
    >
      {{ data.title }}
    </a>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    multipliers: [
      { title: "1x", value: 1 },
      { title: "10x", value: 10 },
      { title: "25x", value: 25 },
      { title: "50x", value: 50 },
      { title: "Max", value: 10000 }
    ]
  }),
  methods: {
    handleClick(value) {
      this.$store.dispatch("xmas/updateLevelGap", value);
    }
  },
  computed: {
    ...mapState({
      levelGap: state => state.xmas.levelGap
    })
  }
};
</script>

<style lang="less" scoped>
.multipliers {
  width: 8rem;
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  overflow: hidden;
  border-radius: 2rem 0 0 2rem;
  z-index: 50;
}
.multiplier {
  width: 8rem;
  height: 8rem;
  background: lightseagreen;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.multiplier.active {
  background: goldenrod;
}
</style>
