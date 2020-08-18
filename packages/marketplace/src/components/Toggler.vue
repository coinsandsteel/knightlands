<template>
  <div class="toggle-collapse" @click="handleToggle">
      <b-icon icon="chevron-double-down" variant="success" :flip-v="value"></b-icon>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BIcon } from 'bootstrap-vue'

export default Vue.extend({
  props: ["value"],
  components: { BIcon },
  data: () => ({
    toggled: false
  }),
  methods: {
    handleToggle() {
      this.$emit("input", !this.value);
    }
  }
});
</script>

<style lang="less" scoped>
@import (reference) "../style/common.less";

.toggle-collapse {
  display: none;
  .medium({display: block;});
}
</style>
