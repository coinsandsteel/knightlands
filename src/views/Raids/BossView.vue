<template>
  <div class="relative flex flex-column boss-view flex-center flex-no-wrap">
    <div class="boss-image absolute-stretch" :style="zoneBackground"></div>

    <span
      class="raid-summon-title font-size-30 relative font-weight-700 enemy-title-font font-outline"
    >{{$t(name)}}</span>

    <div ref="image" class="flex flex-center relative unit-image" v-touch:swipe="swipeHandler">
      <slot name="view"></slot>
      <img :src="enemyImage" v-if="!hasViewSlot" />
    </div>

    <div v-if="navigation" class="nav-arrow left" @click="emitPrevious"></div>
    <div v-if="navigation" class="nav-arrow" @click="emitNext"></div>

    <!-- <div
      v-if="timer"
      class="font-size-20 relative enemy-title-font font-outline font-weight-700"
    >{{timer.value}}</div>-->

    <div class="inner-content pointer-events-none">
      <slot></slot>
    </div>

    <div class="inner-content pointer-events-none">
      <slot name="overlay"></slot>
    </div>

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
  </div>
</template>

<script>
import UiConstants from "@/ui_constants";
import RaidsMeta from "@/raids_meta";
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
      this.$emit("next");
    },
    emitPrevious() {
      this.$emit("previous");
    },
    swipeHandler(direction) {
      if (direction == "left") {
        this.emitNext();
      } else if (direction == "right") {
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
    name() {
      return this.meta.name;
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
    z-index: 1;

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
  background-position: center;
  background-size: cover;
}

.inner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
