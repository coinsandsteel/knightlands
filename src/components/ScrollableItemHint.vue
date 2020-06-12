<template>
  <transition>
    <div class="items-bg-mask relative flex flex-center" @click.self="showHintItems = false">
      <Hooper
        ref="hooper"
        style="height: 100%"
        :infiniteScroll="true"
        :autoPlay="false"
        @slide="updateHintItems"
      >
        <slide v-for="(item, index) in hintItems" :key="index">
          <LootHint
            :item="item.item"
            :equip="!item.equipped"
            :unequip="item.equipped"
            :hideMask="true"
            :showButtons="true"
            :buttons="getHintButtons(item)"
            @close="handleItemAction"
          ></LootHint>
        </slide>
      </Hooper>

      <div class="flex flex-center flex-space-between absolute-stretch pointer-events-none">
        <div class="nav-arrow left"></div>
        <div class="nav-arrow"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";
import LootHint from "@/components/LootHint.vue";

export default {
  components: {
    LootHint,
    Hooper,
    Slide
  },
  methods: {
    updateHintItems(index) {
      let currentSlide = this.currentSlideIndex;
      let maxSlideIndex =
        (this.filteredItems.length < 3 ? this.filteredItems.length : 3) - 1;

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
          hintItemIndex = this.filteredItems.length - 1;
        } else if (hintItemIndex == this.filteredItems.length) {
          hintItemIndex = 0;
        }

        this.$set(this.hintItems, offsetSlideIndex, {
          item: this.filteredItems[hintItemIndex],
          index: hintItemIndex,
          slide: offsetSlideIndex
        });
      }
    }
  }
};
</script>
