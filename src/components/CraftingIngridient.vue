<template>
  <div>
    <loot :locked="notEnoughMaterials" :item="item" :size="size" :hideQuantity="true" @hint="hintHandleFunction" />

    <div v-if="!hideCount && ingridient.maxLevelRequired" class="font-size-20 digit-font">Lvl: {{levelRequired}}</div>
    <div v-else-if="!hideCount" class="font-size-20 digit-font">{{currentCount}}/{{requiredCount}}</div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue"

export default {
  mixins: [HintHandler],
  components: { Loot },
  props: {
    ingridient: Object,
    size: {
      type: String,
      default: ""
    },
    hideCount: Boolean,
    hintHandler: Function
  },
  computed: {
    hintHandleFunction() {
      return this.hintHandler ? this.hintHandler : this.handleHint;
    },
    item() {
      return {
        template: this.ingridient.itemId,
        count: this.currentCount
      };
    },
    requiredCount() {
      return this.ingridient.quantity;
    },
    notEnoughMaterials() {
      if (this.ingridient.maxLevelRequired) {
        return !this.$game.inventory.hasMaxLevelItemByTemplate(this.ingridient.itemId);
      }

      return this.requiredCount > this.currentCount;
    },
    currentCount() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.ingridient.itemId
      );
    },
    levelRequired() {
      if (this.ingridient.maxLevelRequired) {
        return this.$game.itemsDB.getMaxLevel(this.ingridient.itemId, 2);
      }

      return 0;
    }
  }
};
</script>


