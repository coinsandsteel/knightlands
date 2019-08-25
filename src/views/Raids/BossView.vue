<template>
  <div class="pixelated relative flex flex-column boss-view flex-center flex-no-wrap">
    <div class="relative boss-image height-100 width-100" :style="zoneBackground">
      <div
        class="font-size-30 relative enemy-title-font raid-summon-title font-outline font-weight-700"
      >{{$t(name)}}</div>
      <div
        v-if="timer"
        class="font-size-20 relative enemy-title-font raid-summon-title font-outline font-weight-700"
      >{{timer.value}}</div>
      <div ref="image" class="relative raid-boss-image" :style="enemyImage"></div>

      <div class="inner-content">
        <slot></slot>
      </div>
    </div>

    <progress-bar
      v-if="progress"
      v-model="progress.current"
      :maxValue="progress.max"
      height="0.75rem"
      width="80%"
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

export default {
  props: ["raidTemplateId", "progress", "timeLeft", "defeat"],
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
    }
  },
  computed: {
    meta() {
      return RaidsMeta[this.raidTemplateId] || {};
    },
    enemyImage() {
      return UiConstants.backgroundImage(
        UiConstants.enemyImage(this.meta.icon)
      );
    },
    zoneBackground() {
      return UiConstants.backgroundImage(
        UiConstants.zoneImage(this.meta.zoneImage)
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

  overflow: hidden;
}

.raid-boss-image {
  height: 25vh;
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