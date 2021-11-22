<template>
  <div
    ref="farm"
    class="building building-farm font-size-25"
    @click="handleClick"
  >
    TIER {{ tier }}
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import { mapState } from "vuex";

export default {
  props: ["id", "tier"],
  data: () => ({
    animation: null
  }),
  computed: {
    ...mapState({
      mode: state => state.xmas.mode
    })
  },
  mounted() {
    this.$app.$on("farm-blur", this.handleBlur);
  },
  beforeDestroy() {
    this.$app.$off("farm-blur");
  },
  methods: {
    handleClick() {
      // Empty slot
      if (this.tier === 0) {
        if (this.mode === "collect") {
          this.$store.dispatch("xmas/updateMode", "manage");
        }

        if (!this.animation) {
          this.animation = anime({
            targets: this.$refs.farm,
            keyframes: [{ opacity: 1 }, { opacity: 0.5 }],
            direction: "alternate",
            duration: 500,
            loop: true,
            easing: "linear"
          });
        }

        // Existing farm
      } else {
      }
    },
    handleBlur() {
      if (this.animation) {
        this.animation.remove(this.$refs.farm);
        this.animation = null;
        this.$refs.farm.style.opacity = 1;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.building {
  position: absolute;
  text-align: center;
  color: black;
}
.building-farm {
  background: aquamarine;
  height: 15rem;
  width: 30rem;
  padding: 5rem 0;
}
</style>
