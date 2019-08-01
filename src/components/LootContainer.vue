<template>
  <div class="flex loot-container">
    <loot
      v-for="(item, index) in items"
      :item="item"
      :key="index"
      :inventory="inventory"
      :hint="hint"
      @hint="handleHint"
    ></loot>
  </div>
</template>

<script>
import Loot from "./Loot.vue";

export default {
  components: {
    Loot
  },
  props: ["items", "inventory", "hint"],
  props: {
    items: {
      type: Array
    },
    inventory: {
      type: Boolean,
      default: false
    },
    hint: {
      type: Function
    }
  },
  data() {
    return {
      showModal: true
    };
  },
  methods: {
    handleHint(item) {
      this.$emit("hint", item);
    }
  }
};
</script>


<style lang="less" scoped>
@import (reference) "../style/common.less";

.loot-container {
  justify-content: flex-start;
}
</style>

