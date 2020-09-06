<template>
  <div v-bar class="width-100 height-100 dummy-height">
    <div>
      <div
        class="flex flex-center dummy-height inventory-container"
        v-if="items.length > 0"
      >
        <div class="flex loot-container dummy-height inventory-items">
          <loot
            v-for="(item, index) in items"
            :item="item"
            :key="index"
            :inventory="inventory"
            :selected="
              (selectSlots && selected[item.id]) || selectedItem == item.id
            "
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
</template>

<script>
import Loot from "../Loot.vue";

export default {
  props: [
    "items",
    "inventory",
    "lootClasses",
    "lootProps",
    "multiSelect",
    "selectSlots",
    "selectedItem"
  ],
  components: { Loot },
  data: () => ({
    selected: {}
  }),
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
