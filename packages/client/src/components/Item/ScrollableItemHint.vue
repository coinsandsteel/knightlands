<template>
  <div v-show="showHintItems">
    <keep-alive>
      <div
        class="items-bg-mask relative flex flex-center"
        @click.self="showHintItems = false"
      >
        <Hooper
          ref="hooper"
          style="height: 100%"
          :infiniteScroll="true"
          :autoPlay="false"
          @slide="updateHintItems"
        >
          <slide v-for="(slide, index) in hintItems" :key="index">
            <CompareItems
              v-if="isComparable(slide.item)"
              :leftItem="slide.item"
              :rightItem="itemFromMatchingSlot(slide.item)"
              :hideMask="true"
              :equippedItems="equippedItems"
              @close="handleItemAction"
            ></CompareItems>
            <LootHint
              v-else
              :item="slide.item"
              :hideMask="true"
              :showButtons="true"
              :showLocked="true"
              :equippedItems="equippedItems"
              :buttons="getHintButtons(slide.item)"
              @close="handleItemAction"
            ></LootHint>
          </slide>
        </Hooper>
        <div
          class="flex flex-center flex-space-between absolute-stretch pointer-events-none"
        >
          <div class="nav-arrow left"></div>
          <div class="nav-arrow"></div>
        </div>
      </div>
    </keep-alive>
  </div>
</template>

<script>
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";
const ItemType = require("@/../../knightlands-shared/item_type");
import LootHint from "@/components/LootHint.vue";
import DoubleBuffer from "@/helpers/DoubleBuffer";
import CompareItems from "./CompareItems.vue";

export default {
  props: ["items", "getHintButtons", "equippedItems"],
  data: () => ({
    currentSlideIndex: 0,
    hintItems: [],
    showHintItems: false
  }),
  components: {
    LootHint,
    Hooper,
    Slide,
    CompareItems
  },
  created() {
    this._buffer = new DoubleBuffer();
  },
  methods: {
    itemFromMatchingSlot(item) {
      let equippedItems = this.equippedItems;
      if (!equippedItems) {
        equippedItems = this.$character.equipment;
      }

      return equippedItems[this.$game.itemsDB.getSlot(item)];
    },
    isComparable(item) {
      const itemInSlot = this.itemFromMatchingSlot(item);
      return (
        this.$game.itemsDB.getItemType(item) == ItemType.Equipment &&
        itemInSlot &&
        itemInSlot.id != item.id
      );
    },
    showHint(index) {
      let _hintItems = this._buffer.get();
      _hintItems.length = 0;
      this.hintItems = _hintItems;

      this.updateHintItems(index);
      this.showHintItems = true;
      this.$nextTick(() => {
        this.$refs.hooper.updateWidth();
      });
    },
    handleItemAction(item, action, ...args) {
      this.showHintItems = false;
      this.$emit("action", item, action, ...args);
    },
    updateHintItems(index) {
      let currentSlide = this.currentSlideIndex;
      let maxSlideIndex = (this.items.length < 3 ? this.items.length : 3) - 1;

      if (typeof index == "object") {
        currentSlide = index.currentSlide;

        if (currentSlide < 0) {
          currentSlide = maxSlideIndex;
        } else if (currentSlide > maxSlideIndex) {
          currentSlide = 0;
        }

        // get item by slide
        if (this.hintItems.length <= currentSlide) {
          index = 0;
        } else {
          index = this.hintItems[currentSlide].index;
        }
      }

      this.currentSlideIndex = currentSlide;

      for (let i = -1; i < maxSlideIndex; ++i) {
        // find correct indicies for items to place
        let offsetSlideIndex = currentSlide + i;
        if (offsetSlideIndex < 0) {
          offsetSlideIndex = maxSlideIndex;
        } else if (offsetSlideIndex > maxSlideIndex) {
          offsetSlideIndex = 0;
        }

        // find index of corresponding item
        let hintItemIndex = index + i;
        if (hintItemIndex < 0) {
          hintItemIndex = this.items.length - 1;
        } else if (hintItemIndex == this.items.length) {
          hintItemIndex = 0;
        }

        this.$set(this.hintItems, offsetSlideIndex, {
          item: this.items[hintItemIndex],
          index: hintItemIndex,
          slide: offsetSlideIndex
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.items-bg-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.616);
  z-index: 900;
}
</style>
