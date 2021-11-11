<template>
  <div class="relative">
    <PromisedButton
      v-bind="$attrs"
      :sounds="sounds"
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
      default: 500
    },
    noSound: {
      type: Boolean,
      default: false
    }
  },
  components: { PromisedButton },
  computed: {
    sounds() {
      return this.noSound
        ? []
        : ["hit1", "hit2", "hit3", "hit4", "hit5", "hit6", "hit7", "hit8"];
    }
  },
  methods: {
    startCooldown() {
      anime.set(this.$refs.overlay, {
        left: "0%"
      });

      anime({
        targets: this.$refs.overlay,
        left: "100%",
        duration: this.cooldown,
        easing: "easeOutQuint"
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
