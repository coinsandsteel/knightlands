<template>
  <div class="flex flex-items-center flex-no-wrap">
    <div class="flex flex-column flex-center margin-right-half">
      <LockToggle v-if="canLock" :item="item" class="margin-bottom-half" />
      <Loot :item="item" :interactible="false" v-bind="itemProps"></Loot>
    </div>
    <div class="flex flex-column flex-start full-flex">
      <div class="width-100 flex flex-items-center flex-no-wrap">
        <span
          v-if="item"
          class="font-size-20 nowrap font-weight-900 font-outline"
          :class="[rarityClass]"
          >{{ $t(name) }}</span
        >
        <span
          class="font-size-20 nowrap font-weight-900 font-outline margin-left-half"
          v-if="enchant > 0"
          :class="[rarityClass]"
          >{{ `+${enchant}` }}</span
        >
        <div
          v-if="hasElement"
          :class="[{ 'margin-left-half': !hasElement }, elementIcon]"
          class="big"
        ></div>
      </div>

      <div
        v-if="item"
        class="flex flex-items-center flex-no-wrap margin-top-half margin-bottom-1"
        :class="{ pointer: stars < 2 }"
        @click="isEquipment ? upgradeItem() : null"
      >
        <span class="font-size-20 margin-right-1">
          {{ type }}
        </span>
        <template v-if="isEquipment && !isPreview && unbindable">
          <span class="star" :class="{ active: stars >= 1 }"></span>
          <span class="star" :class="{ active: stars >= 2 }"></span>
          <span class="arrow-up" v-if="stars < 2"></span>
        </template>
      </div>

      <slot name="level-bar">
        <div
          class="width-100 flex flex-items-center flex-no-wrap"
          v-if="isEquipment && !isPreview"
        >
          <span class="margin-right-1 font-size-18" v-if="level">{{
            $t("level", { lvl: level })
          }}</span>
          <ProgressBar
            v-if="canBeUpgraded"
            v-model="item.exp"
            :expand="false"
            height="2rem"
            class="full-flex"
            barType="green"
            :maxValue="nextExp"
            :plusButton="preview ? '' : 'green'"
            @refill="handleLevelProgressClick"
          ></ProgressBar>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import LockToggle from "@/components/LockToggle.vue";
import ItemGetterMixin from "./ItemGetterMixin.vue";

export default {
  props: ["itemProps", "showLocked", "preview"],
  mixins: [ItemGetterMixin],
  components: {
    Loot,
    ProgressBar,
    LockToggle
  },
  computed: {
    canLock() {
      if (!this.item) {
        return false;
      }
      return this.showLocked && this.$game.itemsDB.isEquipment(this.item);
    },
    isPreview() {
      return this.count < 1;
    },
    isItemLocked() {
      return this.item.locked;
    }
  },
  methods: {
    upgradeItem() {
      if (this.preview) {
        return;
      }

      this.$router.push({
        name: "unbind-item",
        params: { itemId: this.item.id }
      });
    },
    handleLevelProgressClick() {
      if (this.preview) {
        return;
      }

      this.$router.push({
        name: "upgrade-item",
        params: { itemId: this.item.id }
      });
    }
  }
};
</script>
