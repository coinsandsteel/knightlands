<template>
  <div class="relative flex flex-column boss-view flex-center flex-no-wrap">
    <div
      ref="zoneView"
      class="boss-image absolute-stretch"
      :style="zoneBackground"
    ></div>

    <span
      class="raid-summon-title font-size-30 relative font-weight-700 enemy-title-font font-outline"
      >{{ `${$t(name)} ${$t("unit-lvl", { lvl: level })}` }}</span
    >

    <div ref="image" class="flex flex-center relative unit-image">
      <slot name="view"></slot>
      <img :src="enemyImage" v-if="!hasViewSlot" />
    </div>

    <div
      v-if="navigation"
      class="nav-arrow left"
      :class="raidTemplateId <= 1 ? 'opacity-50 pointer-events-none' : ''"
      @click="emitPrevious"
    ></div>
    <div
      v-if="navigation"
      class="nav-arrow"
      :class="raidTemplateId >= 50 ? 'opacity-50 pointer-events-none' : ''"
      @click="emitNext"
    ></div>

    <!-- <div
      v-if="timer"
      class="font-size-20 relative enemy-title-font font-outline font-weight-700"
    >{{timer.value}}</div>-->

    <progress-bar
      v-if="progress"
      v-model="progress.current"
      :maxValue="progress.max"
      height="0.75rem"
      width="90%"
      valuePosition="top"
      barType="yellow"
      valueClass="white-font font-outline font-size-20"
      :thresholds="thresholds"
      class="boss-health"
    ></progress-bar>

    <div class="inner-content" v-touch:swipe="swipeHandler">
      <slot></slot>
    </div>

    <div class="inner-content pointer-events-none">
      <slot name="overlay"></slot>
    </div>
  </div>
</template>

<script>
import UiConstants from "@/ui_constants";
import RaidsMeta from "@/metadata/raids_meta";
import ProgressBar from "@/components/ProgressBar.vue";
import Timer from "@/timer.js";
import Campaign from "@/campaign_database";

export default {
  props: ["raidTemplateId", "progress", "timeLeft", "defeat", "navigation"],
  components: { ProgressBar },
  data: () => ({
    thresholds: UiConstants.progressThresholds,
    timer: null
  }),
  mounted() {
    this.updateTimer();
  },
  watch: {
    timeLeft() {
      this.updateTimer();
    }
  },
  methods: {
    updateTimer() {
      if (this.timeLeft) {
        this.timer = new Timer(true);
        this.timer.timeLeft = this.timeLeft;
        this.timer.update();
      }
    },
    emitNext() {
      if (this.raidTemplateId >= 50) {
        return;
      }
      this.$emit("next");
    },
    emitPrevious() {
      if (this.raidTemplateId <= 1) {
        return;
      }
      this.$emit("previous");
    },
    swipeHandler(direction) {
      if (direction == "left" && this.raidTemplateId < 50) {
        this.emitNext();
      } else if (direction == "right" && this.raidTemplateId > 1) {
        this.emitPrevious();
      }
    }
  },
  computed: {
    hasViewSlot() {
      return !!this.$slots["view"];
    },
    meta() {
      return RaidsMeta[this.raidTemplateId] || {};
    },
    enemyImage() {
      return Campaign.getRaidImage(this.raidTemplateId);
    },
    zoneBackground() {
      return UiConstants.backgroundImage(
        Campaign.getRaidBackground(this.raidTemplateId)
      );
    },
    level() {
      return this.meta.level;
    },
    name() {
      return this.meta.name;
    },
    center() {
      let offset = UiConstants.offset(this.$refs.zoneView);
      return {
        x: offset.width / 2,
        y: offset.top + offset.height / 2
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.boss-view {
  width: 100%;
  height: 40vh;

  .mobile({height: 35vh});

  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 5rem 1fr 5rem 5rem 1fr;
  grid-template-columns: 5rem 1fr 5rem;

  > .raid-summon-title {
    grid-row: ~"1";
    grid-column: ~"1/4";
  }

  > .unit-image {
    grid-row: ~"2/6";
    grid-column: ~"1/4";

    place-self: stretch;
  }

  > .nav-arrow {
    grid-row: ~"2/5";
    grid-column: ~"3";
    z-index: 81;

    &.left {
      grid-column: ~"1";
    }
  }

  > .boss-health {
    grid-row: ~"7";
    grid-column: ~"1/4";
  }
}

.unit-image {
  > img {
    max-width: 100%;
    max-height: 100%;
  }
}

.raid-boss-image {
  position: absolute;
  bottom: 2rem;
  left: 0;
  height: 90%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.boss-image {
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
}

.inner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 80;
}
</style>
