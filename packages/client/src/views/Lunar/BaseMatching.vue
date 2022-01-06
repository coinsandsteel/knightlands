<template>
  <div class="full-flex dummy-height width-100">
    <div
      class="width-100 height-100 dummy-height flex flex-column flex-no-wrap font-weight-900"
    >
      <MatchingContainer />
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
                v-for="(item, index) in items"
                :id="`i-${item.template}`"
                :item="816"
                :key="index"
                :inventory="false"
                :selected="false"
                :_selected="
                  (selectSlots && selected[item.id]) || selectedItem == item.id
                "
                :_class="lootClasses"
                _v-bind="lootProps"
              />
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
      selectSlots: [],
      lootClasses: [],
      selected: {},
      selectedItem: null
    };
  },
  computed: {
    items() {
      const items = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
      return [
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items,
        ...items
      ];
    }
  },
  methods: {
    selectedItems() {
      // return this.selected;
    },
    // handleHint(item, index) {
    handleHint() {
      // if (this.selectSlots && this.multiSelect) {
      //   if (this.selected[item.id]) {
      //     this.$delete(this.selected, item.id);
      //   } else {
      //     this.$set(this.selected, item.id, true);
      //   }
      //   this.$emit("selected", item, index, this.selected[item.id]);
      // } else {
      //   this.$emit("hint", item, index);
      //   this.selected = {
      //     [item.id]: true
      //   };
      // }
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
</style>
