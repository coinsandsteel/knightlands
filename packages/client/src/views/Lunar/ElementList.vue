<template>
  <div v-bar class="center width-100 height-100 dummy-height">
    <div>
      <div
        class="element-container width-100 dummy-height inventory-container"
        v-if="items.length > 0"
      >
        <template v-if="false">
          <Element
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
        </template>
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

      <div class="flex flex-center width-100 height-100 v-bar-fix" v-else>
        <slot>
          <div></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Element from "@/views/Lunar/Element.vue";
import Loot from "@/components/Loot.vue";

export default {
  props: [
    "items",
    "inventory",
    "lootClasses",
    "lootProps",
    "multiSelect",
    "selectSlots",
    "selectedItem",
    "noScroll"
  ],
  components: { Element, Loot },
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
.element-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
</style>
