<template>
  <div>
    <loot :item="item" />
    <div>{{currentCount}} / {{requiredCount}}</div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";

export default {
  components: { Loot },
  props: ["ingridient"],
  computed: {
    item() {
      return {
        template: this.ingridient.itemId,
        count: 0
      };
    },
    currentCount() {
      return this.$game.inventory.getItemCount(this.ingridient.itemId);
    },
    requiredCount() {
      return this.ingridient.quantity;
    }
  }
};
</script>

<style lang="less" scoped>
</style>


