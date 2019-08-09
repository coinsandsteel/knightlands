<template>
  <div class="full-flex panel current-raid-cell">
    <span class="current-raid-name center-transform title font-size-20 enemy-title-font">{{name}}</span>

    <div class="flex full-flex width-100 height-100">
      <div class="flex-basis-50">
        <div class="current-raid-image pixelated" :style="raidImage"></div>
      </div>

      <div class="flex-basis-50 flex flex-column flex-item-center" v-if="!finished">
        <span>Time Left: {{timeLeft}}</span>
        <custom-button type="grey">Continue</custom-button>
      </div>

      <div class="flex-basis-50 flex flex-column flex-item-center" v-else>
        <custom-button type="green">Claim</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
const RaidsMeta = require("@/raids_meta.json");
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["raidData"],
  components: { CustomButton },
  data: () => ({
    timeLeft: "",
    timerTimeout: undefined
  }),
  watch: {
    raidData() {
      clearTimeout(this.timerTimeout);
      this.updateTimerValue();
    }
  },
  computed: {
    name() {
      return RaidsMeta[this.raidData.raidTemplateId].name;
    },
    finished() {
      return this.raidData.bossState.health <= 0;
    },
    raidImage() {
      return `background-image: url("${UiConstants.enemyImage(
        RaidsMeta[this.raidData.raidTemplateId].icon
      )}");`;
    }
  },
  methods: {
    updateTimerValue() {
      if (this.raidData.timeLeft <= 0) {
        return;
      }

      let now = Math.floor(new Date().getTime() / 1000);
      let timeUntilNextPoint =
        this.timer.regenTime - (now - this.timer.lastRegenTime);
      let minutes = Math.floor(timeUntilNextPoint / 60);
      let seconds = timeUntilNextPoint % 60;
      let leadingZeroesForSeconds = seconds > 9 ? "" : 0;
      this.timerValue = `0${minutes}:${leadingZeroesForSeconds}${seconds}`;

      this.timerTimeout = setTimeout(() => {
        this.updateTimerValue();
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
@panelHeight: 12.875rem;

.current-raid-cell {
  height: @panelHeight;
  position: relative;
}

.current-raid-name {
  position: absolute;
  top: 0;
}

.current-raid-image {
  flex: 1 1;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
</style>


