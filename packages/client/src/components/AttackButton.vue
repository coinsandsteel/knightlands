<template>
  <div class="relative">
    <PromisedButton
      v-bind="$attrs"
      @click="handleClick"
      @promiseFinished="startCooldown"
    >
      <slot></slot>
    </PromisedButton>
    <div ref="overlay" class="cooldown-overlay"></div>
  </div>
</template>

<script>
import PromisedButton from "@/components/PromisedButton.vue";
import anime from "animejs/lib/anime.es.js";

export default {
  props: {
    cooldown: {
      type: Number,
      default: 600
    }
  },
  components: { PromisedButton },
  methods: {
    startCooldown() {
      anime.set(this.$refs.overlay, {
        left: "0%"
      });

      anime({
        targets: this.$refs.overlay,
        left: "100%",
        duration: this.cooldown,
        easing: "easeInCirc"
      });

      this._cooldownTimer = setTimeout(() => {
        this._cooldownTimer = null;
      }, this.cooldown);
    },
    handleClick() {
      if (this._cooldownTimer) {
        return;
      }

      this.$emit("click");
    }
  }
};
</script>

<style lang="less" scoped>
.cooldown-overlay {
  background-color: #01001fcc;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  right: 0;
}
</style>
