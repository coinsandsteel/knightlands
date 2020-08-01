<template>
  <div class="relative flex flex-column boss-view flex-center flex-no-wrap">
    <div class="boss-image absolute-stretch" :style="zoneBackground"></div>

    <Title
      class="flex-1"
      titleClass="font-size-30 relative font-weight-700 enemy-title-font raid-summon-title font-outline "
    >{{$t(name)}}</Title>

    <div
      ref="image"
      class="flex flex-items-end flex-center relative unit-image"
      v-touch:swipe="swipeHandler"
    >
      <img :src="enemyImage" class="pointer-events-none" />

      <div class="nav-arrow left" @click="emitPrevious"></div>
      <div class="nav-arrow" @click="emitNext"></div>
    </div>

    
    <div
      v-if="timer"
      class="font-size-20 relative enemy-title-font raid-summon-title font-outline font-weight-700"
    >{{timer.value}}</div>

    <div class="inner-content pointer-events-none">
      <slot></slot>
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
import Title from "@/components/Title.vue";

export default {
  props: ["raidTemplateId", "progress", "timeLeft", "defeat", "navigation"],
  components: { ProgressBar, Title },
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
.boss-view {
  width: 100%;
  height: 35vh;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .quest-nav:first-child {
    padding-left: 1rem;
  }

  .quest-nav:last-child {
    padding-right: 1rem;
  }
}

.unit-image {
  height: 80%;
  width: 100%;

  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-rows: 1fr 5rem 1fr;
  grid-template-columns: 5rem 1fr 5rem;

  > img {
    max-width: 100%;
    max-height: 100%;

    grid-row: ~"1/4";
    grid-column: ~"1/4";
  }

  > .nav-arrow {
    grid-row: ~"2";
    grid-column: ~"3";

    &.left {
      grid-column: ~"1";
    }
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
