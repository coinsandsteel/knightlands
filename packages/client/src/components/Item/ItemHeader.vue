<template>
  <div
    class="flex flex-items-center flex-no-wrap"
  >
    <loot
      :item="item"
      :interactible="false"
      v-bind="itemProps"
      class="margin-right-1"
    ></loot>
    <div class="flex flex-column flex-start full-flex">
      <div class="width-100 flex flex-items-center flex-no-wrap">
        <span
          v-if="item"
          class="font-size-20 nowrap font-weight-900 font-outline"
          :class="[{ 'margin-right-1': !hasElement }, rarityClass]"
          >{{ type }}</span
        >
        <div v-if="hasElement" :class="elementIcon" class="big"></div>
      </div>

      <div
        class="flex flex-items-center flex-no-wrap margin-top-half margin-bottom-1"
        v-if="isEquipment && !isPreview"
      >
        <span class="star" :class="{ active: stars >= 1 }"></span>
        <span
          class="star"
          :class="{ active: stars >= 2 }"
        ></span>
        <span class="arrow-up" v-if="stars < 2" @click="upgradeItem"></span>
      </div>

      <slot name="level-bar">
        <div
          class="width-100 flex flex-center flex-no-wrap"
          v-if="isEquipment && !isPreview"
        >
          <span class="margin-right-1 font-size-18">{{
            $t("level", { lvl: level })
          }}</span>
          <progress-bar
            v-model="item.exp"
            :expand="false"
            height="2rem"
            class="full-flex"
            barType="green"
            :maxValue="nextExp"
            plusButton="green"
            @refill="handleLevelProgressClick"
          ></progress-bar>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import ItemGetterMixin from "./ItemGetterMixin.vue";

export default {
  props: ["itemProps"],
  mixins: [ItemGetterMixin],
  components: {
    Loot,
    ProgressBar
  },
  computed: {
    isPreview() {
      return this.count < 1;
    }
  },
  methods: {
    upgradeItem() {
      this.$router.push({
        name: "unbind-item",
        params: { itemId: this.item.id }
      });
    },
    handleLevelProgressClick() {
      this.$router.push({
        name: "upgrade-item",
        params: { itemId: this.item.id }
      });
    }
  }
};
</script>
