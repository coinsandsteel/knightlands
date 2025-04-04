<template>
  <div>
    <Title :stackTop="true" :stackBottom="true" :class="[`rarity-${rarity}`]">{{
      $t("adventure-title", { rarity: $t(rarity) })
    }}</Title>

    <div
      class="color-panel-5 stacked-top stacked-bottom flex flex-space-between margin-top-1 padding-right-1 padding-left-1"
    >
      <div class="flex flex-10">
        <Loot
          v-for="record in loot"
          :item="record.itemId"
          :key="record.itemId"
          :quantity="record.minCount"
          :gacha="true"
          @hint="handleHint"
        ></Loot>

        <div class="random-loot" v-if="hasRandom">
          <div></div>
        </div>
      </div>

      <div class="flex flex-column flex-4 flex-space-evenly">
        <span class="panel-input padding-top-half padding-bottom-half">
          <IconWithValue
            iconClass="icon-timer small"
            valueClass="font-size-18"
            >{{ timer.value }}</IconWithValue
          >
        </span>

        <span
          class="green-title font-size-18"
          v-if="!preview && timer.timeLeft > 0"
          >{{ $t("adventure-in-progress") }}</span
        >
        <CustomButton
          type="green"
          @click="$emit('claim')"
          v-else-if="timer.timeLeft <= 0"
          >{{ $t("claim-adventure") }}</CustomButton
        >
        <CustomButton type="yellow" @click="$emit('start')" v-else>{{
          $t("start-adventure")
        }}</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue";
import HintHandler from "@/components/HintHandler.vue";
import Title from "@/components/Title.vue";

export default {
  mixins: [HintHandler],
  components: { Loot, CustomButton, IconWithValue, Title },
  props: ["adventure", "preview"],
  data: () => ({
    timer: new Timer(true)
  }),
  watch: {
    adventure: {
      deep: true,
      handler() {
        this.refreshTimer();
      }
    }
  },
  mounted() {
    this.refreshTimer();
  },
  computed: {
    rarity() {
      return this.adventure.rarity;
    },
    loot() {
      return this.adventure.loot.guaranteedRecords;
    },
    hasRandom() {
      return this.adventure.loot.records.length > 0;
    }
  },
  methods: {
    refreshTimer() {
      if (this.preview) {
        this.timer.timeLeft = this.adventure.duration;
        this.timer.stop();
      } else {
        this.timer.timeLeft =
          this.adventure.duration -
          (this.$game.now - this.adventure.startTime) / 1000;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.random-loot {
  position: relative;
  .item_slot_dark;

  width: @lootCellSize;
  height: @lootCellSize;

  & > div {
    .icon_random;
    width: @lootCellSize;
    height: @lootCellSize;
  }
}
</style>
