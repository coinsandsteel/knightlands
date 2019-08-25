<template>
  <div>
    <div class="flex flex-center panel inventory-container">
      <div class="flex loot-container inventory-items">
        <loot
          v-for="item in items"
          :item="item"
          :key="item.id"
          :inventory="inventory"
          :hint="hint"
          @hint="handleHint"
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

@inventoryPadding: 1rem;
@inventoryMargin: 0.5rem;
@marginBetweenItems: 0.3rem;

.inventory-container {
  margin: @inventoryMargin;
  padding: @inventoryPadding;
}

.width(@cells) {
  width: @lootCellSize * @cells + @marginBetweenItems*2 * @cells;
}

.mobileWidth(@cells) {
  width: @mobileLootCellSize * @cells + @marginBetweenItems*2 * @cells;
}

.inventory-items {
  .width(7);

  .mobile({.mobileWidth(5)});

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

