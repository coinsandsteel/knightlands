<template>
  <div class="flex flex-items-center">
    <loot
      :item="item"
      :interactible="false"
      v-bind="itemProps"
      class="margin-right-2"
    ></loot>
    <div class="flex flex-column flex-center full-flex">
      <div class="width-100 flex flex-items-center">
        <span
          v-if="item"
          class="font-size-20 font-weight-900 font-outline"
          :class="{ 'margin-right-1': !hasElement }"
          >{{ type }}</span
        >
        <div v-if="hasElement" :class="elementIcon" class="big"></div>
        <div class="flex flex-center" v-if="isEquipment">
          <span class="star" :class="{ active: stars >= 1 }"></span>
          <span
            class="star margin-right-auto"
            :class="{ active: stars >= 2 }"
          ></span>
          <span class="arrow-up" v-if="stars < 2" @click="upgradeItem"></span>
        </div>
      </div>

      <div
        class="margin-top-1 width-100 flex flex-center flex-no-wrap"
        v-if="isEquipment"
      >
        <span class="margin-right-1 font-size-18">{{
          $t("level", { lvl: item.level })
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
          v-if="isEquipment"
        ></progress-bar>
      </div>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import ItemGetterMixin from "./ItemGetterMixin.vue";

export default {
  props: ["item", "itemProps"],
  mixins: [ItemGetterMixin],
  components: {
    Loot,
    ProgressBar
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
