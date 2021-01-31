<template>
  <div v-bar class="center width-100 height-100 dummy-height">
    <div>
      <div
        class="loot-container width-100 dummy-height inventory-container"
        v-if="items.length > 0"
      >
        <Loot
          v-for="(item, index) in items"
          :id="`i-${item.template}`"
          :item="item"
          :key="index"
          :inventory="inventory"
          :selected="
            (selectSlots && selected[item.id]) || selectedItem == item.id
          "
          :class="lootClasses"
          @hint="handleHint(item, index)"
          v-bind="lootProps"
        />
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

<style lang="less" scoped>
.loot-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  justify-items: center;
}
</style>
