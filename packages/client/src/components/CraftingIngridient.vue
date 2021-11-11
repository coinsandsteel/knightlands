<template>
  <div class="flex flex-column flex-center relative">
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
    >
      {{ $t("level", { lvl: levelRequired }) }}
    </div>

    <div v-else-if="!hideCount" class="font-size-18 digit-font">
      <span v-if="!hideCurrentCount">{{ currentCount }}&nbsp;/&nbsp;</span><span>{{ requiredCount }}</span>
    </div>

    <div
      v-if="placeholder && !placeholderProvided"
      class="plus-btn pointer-events-none"
    ></div>
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
    },
    placeholderIndex: Number,
    placeholderItem: Object,
    placeholderProvided: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    placeholder() {
      return this.ingridient.placeholder;
    },
    placeholderItems() {
      return this.ingridient.placeholderItems;
    },
    hintHandleFunction() {
      if (this.placeholder) {
        return () => this.$emit("plus", this.ingridient);
      }

      return this.hintHandler ? this.hintHandler : this.handleHint;
    },
    item() {
      let itemId = this.ingridient.itemId;
      if (this.placeholder) {
        itemId = this.placeholderItems[this.placeholderIndex];
      }
      
      return {
        template: itemId,
        count: this.currentCount * this.quantity
      };
    },
    requiredCount() {
      return (this.ingridient.quantity || 1) * this.quantity;
    },
    notEnoughMaterials() {
      return !this.$game.inventory.hasEnoughIngridient({
        maxLevelRequired: this.ingridient.maxLevelRequired,
        itemId: this.item.template,
        quantity: this.ingridient.quantity
      });
    },
    currentCount() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.ingridient.itemId
      );
    },
    levelRequired() {
      if (this.ingridient.maxLevelRequired) {
        return this.$game.itemsDB.getMaxLevel(this.item, 2);
      }

      return 0;
    }
  }
};
</script>

<style lang="less" scoped>
.plus-btn {
  background-image: url("../assets/ui/button_plus_training_camp.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 0;
  transform: translateY(50%);
}
</style>
