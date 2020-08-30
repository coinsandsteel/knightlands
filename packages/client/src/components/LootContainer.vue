<template>
  <div class="flex full-flex dummy-height">
    <div v-bar class="width-100 height-100 dummy-height">
      <div>
        <div
          class="flex flex-center dummy-height inventory-container"
          v-if="filteredItems.length > 0"
        >
          <div class="flex loot-container dummy-height inventory-items">
            <loot
              v-for="(item, index) in filteredItems"
              :item="item"
              :key="index"
              :inventory="inventory"
              :selected="selected[item.id] || selectedItem == item.id"
              :class="lootClasses"
              @hint="handleHint(item, index)"
              v-bind="lootProps"
            ></loot>
          </div>
        </div>

        <div class="flex flex-center width-100 height-100 v-bar-fix" v-else>
          <slot>
            <div></div>
          </slot>
        </div>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="isActive && !hideFilters">
      <CustomButton type="grey" @click="showItemFilter">{{
        $t("btn-filter")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "./Loot.vue";
import FilteredLootMixin from "@/components/FilteredLootMixin.vue";
import CustomButton from "@/components/Button.vue";

export default {
  mixins: [FilteredLootMixin, ActivityMixin],
  components: {
    Loot,
    CustomButton
  },
  data: () => ({
    selected: {}
  }),
  props: {
    inventory: {
      type: Boolean,
      default: false
    },
    selectSlots: Boolean,
    multiSelect: Boolean,
    lootProps: Object,
    lootClasses: String,
    selectedItem: Number,
    filters: Object,
    hideFilters: Boolean
  },
  watch: {
    items() {
      this.selected = {};
    },
    filters() {
      this.updateItems(this.filters);
    }
  },
  methods: {
    selectedItems() {
      return this.selected;
    },
    handleHint(item, index) {
      if (this.selectSlots && this.multiSelect) {
        if (this.selected[item.id]) {
          this.$delete(this.selected, item.id);
        } else {
          this.$set(this.selected, item.id, true);
        }
        this.$emit("selected", item, index, this.selected[item.id]);
      } else {
        this.$emit("hint", item, index);

        this.selected = {
          [item.id]: true
        };
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

.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
</style>
