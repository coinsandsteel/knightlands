<template>
  <a
    ref="btn"
    class="mode-switch font-size-25 flex flex-center"
    :class="['mode-switch-' + mode]"
    @click="toggleMode"
  >
    <div class="mode-switch-text">
      {{ $t(mode === "collect" ? "xmas-mode-collect" : "xmas-mode-manage") }}
    </div>
    <div class="mode-switch-corner mode-switch-corner-top"></div>
    <div class="mode-switch-corner mode-switch-corner-right"></div>
  </a>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      mode: state => state.xmas.mode
    })
  },
  methods: {
    toggleMode() {
      this.$store.dispatch(
        "xmas/updateMode",
        this.mode === "collect" ? "manage" : "collect"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.mode-switch {
  position: absolute;
  bottom: 0;
  left: 0;
  background: darkslateblue;
  height: 7rem;
  padding: 0 3rem;
  z-index: 15;
}
.mode-switch-corner {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent transparent transparent darkslateblue;
}
.mode-switch-corner.mode-switch-corner-top {
  left: 0;
  top: -5rem;
  border-width: 5rem 0 0 5rem;
}
.mode-switch-corner.mode-switch-corner-right {
  top: 0;
  right: -5rem;
  border-width: 7rem 0 0 5rem;
}

.mode-switch.mode-switch-collect {
  background: darkgreen;
}
.mode-switch.mode-switch-collect .mode-switch-corner {
  border-color: transparent transparent transparent darkgreen;
}
</style>
