<template>
  <div>
    <loot
      :locked="!noLocking && notEnoughMaterials"
      :item="item"
      :size="size"
      :hideQuantity="true"
      @hint="hintHandleFunction"
    />
    <div
      v-if="!hideCount && ingridient.maxLevelRequired"
      class="font-size-18 digit-font"
    >Lvl:{{levelRequired}}</div>

    <div v-else-if="!hideCount" class="font-size-18 digit-font">
      <span v-if="!hideCurrentCount">{{currentCount}}/</span>
      <span>{{requiredCount}}</span>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

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
    hintHandler: Function,
    hideCurrentCount: Boolean,
    noLocking: Boolean,
    quantity: {
      type: Number,
      default: 1
    }
  },
  computed: {
    hintHandleFunction() {
      return this.hintHandler ? this.hintHandler : this.handleHint;
    },
    item() {
      return {
        template: this.ingridient.itemId,
        count: this.currentCount * this.quantity
      };
    },
    requiredCount() {
      return (this.ingridient.quantity || 1) * this.quantity;
    },
    notEnoughMaterials() {
      return !this.$game.inventory.hasEnoughIngridient(this.ingridient);
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


