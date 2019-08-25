<template>
  <div>
    <loot :item="item" />
    <div class="font-size-20 digit-font">{{currentCount()}} / {{requiredCount}}</div>
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
    requiredCount() {
      return this.ingridient.quantity;
    }
  },
  methods: {
    currentCount() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.ingridient.itemId
      );
    }
  }
};
</script>

<style lang="less" scoped>
</style>


