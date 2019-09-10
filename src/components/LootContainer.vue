<template>
  <div>
    <div class="flex flex-center inventory-container" :type="panel">
      <div class="flex loot-container inventory-items">
        <loot
          v-for="(item, index) in items"
          :item="item"
          :key="item.id"
          :inventory="inventory"
          :hint="hint"
          :selected="selected == item.id"
          :class="lootClasses"
          @hint="handleHint(item, index)"
          v-bind="lootProps"
        ></loot>
      </div>
    </div>
  </div>
</template>

<script>
import Loot from "./Loot.vue";

export default {
  components: {
    Loot
  },
  data:()=>({
    selected: null
  }),
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
    },
    panel : String,
    selectSlots: Boolean,
    lootProps: Object,
    lootClasses: String
  },
  methods: {
    handleHint(item, index) {
      this.$emit("hint", item, index);

      if (this.selectSlots) {
        this.selected = item.id;
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import (reference) "../style/common.less";

.loot-container {
  justify-content: flex-start;
}

@inventoryPadding: 1rem;
@inventoryMargin: 0.5rem;
@marginBetweenItems: 0rem;

.inventory-container {
  margin: @inventoryMargin;
  // padding: @inventoryPadding;
}

.width(@cells) {
  width: @lootCellSize * @cells + @marginBetweenItems*2 * @cells;
}

.mobileWidth(@cells) {
  width: @mobileLootCellSize * @cells + @marginBetweenItems*2 * @cells;
}

.inventory-items {
  .width(7);

  .mobile({.mobileWidth(6)});

  // @media only screen and (max-width: 450px) and (min-width: 400px) {
  //   .width(7);
  // }

  // @media only screen and (max-width: 480px) and (min-width: 451px) {
  //   .width(8);
  // }

  & > * {
    margin: @marginBetweenItems;
  }
}
</style>

