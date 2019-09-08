<template>
  <div>
    <loot :locked="notEnoughMaterials" :item="item" :size="size" :hideQuantity="true" />
    <div v-if="!hideCount" class="font-size-20 digit-font">{{currentCount}}/{{requiredCount}}</div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";

export default {
  components: { Loot },
  props: {
    ingridient: Object,
    size: {
      type: String,
      default: ""
    },
    hideCount: Boolean
  },
  computed: {
    item() {
      return {
        template: this.ingridient.itemId,
        count: 0
      };
    },
    requiredCount() {
      return this.ingridient.quantity;
    },
    notEnoughMaterials() {
      return this.requiredCount > this.currentCount;
    },
    currentCount() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.ingridient.itemId
      );
    }
  }
};
</script>


