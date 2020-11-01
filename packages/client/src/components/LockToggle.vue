<template>
  <div class="lock-btn" :class="{ locked: locked }" @click="toggleLock"></div>
</template>

<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  props: ["item"],
  computed: {
    locked() {
      return this.item ? this.item.locked : false;
    }
  },
  methods: {
    toggleLock() {
      if (this.item.locked) {
        this.performRequest(this.$game.unlockItem(this.item.id));
      } else {
        this.performRequest(this.$game.lockItem(this.item.id));
      }
    }
  }
};
</script>

<style lang="less" scoped>
.lock-btn {
  background-image: url("../assets/ui/button_unlock.png");
  background-size: contain;
  background-position: center;
  width: 5rem;
  height: 5rem;

  &.locked {
    background-image: url("../assets/ui/button_lock.png");
  }
}
</style>
