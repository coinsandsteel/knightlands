<template>
  <div class="flex full-flex">
    <ItemList
      ref="list"
      :lootClasses="lootClasses"
      :multiSelect="multiSelect"
      :selectSlots="selectSlots"
      :selectedItem="selectedItem"
      :lootProps="lootProps"
      :inventory="inventory"
      :items="filteredItems"
      :noScroll="noScroll"
      @hint="handleHint"
    />
    <div
      class="width-100 flex flex-center margin-top-2 margin-bottom-2"
      v-show="hasHiddenItems"
    >
      <span class="font-size-22 font-weight-900 grey-title">
        {{ $t("hidden-items") }}
      </span>
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
import ItemList from "@/components/Item/ItemList.vue";
import FilteredLootMixin from "@/components/FilteredLootMixin.vue";
import CustomButton from "@/components/Button.vue";

export default {
  mixins: [FilteredLootMixin, ActivityMixin],
  components: {
    CustomButton,
    ItemList
  },
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
    hideFilters: Boolean,
    noScroll: Boolean
  },
  computed: {
    hasHiddenItems() {
      return this.items.length > 0 && this.filteredItems.length == 0;
    }
  },
  methods: {
    handleHint(item, index) {
      this.$emit("hint", item, index, this.filteredItems);
    },
    selectedItems() {
      return this.$refs.list.selectedItems();
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
