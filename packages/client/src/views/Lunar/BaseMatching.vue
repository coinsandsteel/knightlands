<template>
  <div class="full-flex dummy-height width-100">
    <div
      class="width-100 height-100 dummy-height flex flex-column flex-no-wrap font-weight-900"
    >
      <MatchingContainer
        :maxSelectedItems="maxSelectedItems"
        :selectedItems="selectedItems"
        @item-removed="handleHint"
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
</template>

<script>
import MatchingContainer from "@/views/Lunar/MatchingContainer.vue";
import Loot from "@/components/Loot.vue";

export default {
  components: {
    MatchingContainer,
    Loot
  },
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
        items.push({
          id: i,
          template: 2495,
          count: 1,
          level: 1,
          exp: 0,
          equipped: false,
          breakLimit: 0,
          unique: false,
          rarity: "epic",
          element: "physical",
          index: 13
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
      if (index >= 0) {
        this.selectedItems.splice(index, 1);
        this.selectedItemId = null;
      } else if (this.selectedItems.length < this.maxSelectedItems) {
        this.selectedItems.push(item);
        this.selectedItemId = item.id;
      } else {
        this.selectedItemId = null;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.element-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
.select-overlay {
  background-color: #102a2491;
  border-radius: 2px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
