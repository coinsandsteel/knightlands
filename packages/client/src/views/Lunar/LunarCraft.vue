<template>
  <div class="screen-content">
    <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <CraftContainer
          :maxSelectedItems="maxSelectedItems"
          :selectedItems="selectedItems"
          @item-removed="itemRemovedHandler"
          @items-reset="itemsResetHandler"
        />
        <div
          class="inv-root dummy-height full-flex width-100 height-100 margin-top-1"
        >
          <div v-bar class="center width-100 height-100 dummy-height">
            <div>
              <div
                class="element-container width-100 dummy-height inventory-container"
                v-if="items.length > 0"
              >
                <Loot
                  v-for="item in items"
                  :id="`i-${item.template}`"
                  :item="item"
                  :key="item.id"
                  :inventory="false"
                  :selected="selectedItemId === item.id"
                  :itemSlotClasses="
                    item && item.itemSlotClasses ? item.itemSlotClasses : null
                  "
                  :iconClasses="
                    item && item.iconClasses ? item.iconClasses : null
                  "
                  @hint="handleHint"
                >
                  <div
                    v-if="
                      selectedItemIds.includes(item.id) &&
                        selectedItemId !== item.id
                    "
                    class="select-overlay flex flex-center"
                  />
                </Loot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CraftContainer from "@/views/Lunar/CraftContainer.vue";
import Loot from "@/components/Loot.vue";
export default {
  components: { CraftContainer, Loot },
  data() {
    return {
      selectedItems: [],
      lootClasses: [],
      selected: {},
      selectedItemId: null,
      maxSelectedItems: 3
    };
  },
  computed: {
    items() {
      const items = [];

      for (let i = 1; i < 100; i++) {
        const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        items.push({
          id: i,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: "basic-lantern" + index,
          isCustomElement: true,
          // template: 2928
          count: index
          // level: 1,
          // exp: 0,
          // equipped: false,
          // breakLimit: 0,
          // unique: false,
          // rarity: "epic",
          // element: "physical",
          // index: 13
        });
      }

      return items;
    },
    selectedItemIds() {
      return this.selectedItems.map(({ id }) => id);
    }
  },
  methods: {
    handleHint(item) {
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      // if (index >= 0) {
      //   this.selectedItems.splice(index, 1);
      //   this.selectedItemId = null;
      // } else if (this.selectedItems.length < this.maxSelectedItems) {
      //   this.selectedItems.push(item);
      //   this.selectedItemId = item.id;
      // } else {
      //   this.selectedItemId = null;
      // }
      if (index < 0 && this.selectedItems.length < this.maxSelectedItems) {
        this.selectedItems.push(item);
        this.selectedItemId = item.id;
        return;
      }
      this.selectedItemId = null;
    },

    itemRemovedHandler(item) {
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      this.selectedItems.splice(index, 1);
      this.selectedItemId = null;
    },

    itemsResetHandler() {
      this.selectedItems = [];
      this.selectedItemId = null;
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.element-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  grid-gap: 2rem;
}
</style>
