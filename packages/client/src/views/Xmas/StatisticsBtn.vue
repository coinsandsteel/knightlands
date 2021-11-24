<template>
  <a
    ref="btn"
    class="stat-btn font-size-25 flex flex-center"
    @click="handleClick"
  >
    <div class="stat-btn-text">
      Statistics
    </div>
    <div class="stat-btn-corner stat-btn-corner-bottom"></div>
    <div class="stat-btn-corner stat-btn-corner-left"></div>
  </a>
</template>

<script>
import { mapState } from "vuex";

export default {
  methods: {
    handleClick() {
      
    }
  }
};
</script>

<style lang="less" scoped>
.stat-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: lightgreen;
  height: 7rem;
  padding: 0 3rem;
  z-index: 15;
}
.stat-btn-corner {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent lightgreen transparent transparent;
}
.stat-btn-corner.stat-btn-corner-bottom {
  right: 0;
  top: 5rem;
  border-width: 0 5rem 5rem 0;
}
.stat-btn-corner.stat-btn-corner-left {
  top: 0;
  left: -5rem;
  border-width: 0 5rem 7rem 0;
}
</style>
