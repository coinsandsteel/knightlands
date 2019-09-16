<template>
  <div class="full-flex panel current-raid-cell">
    <span class="current-raid-name max-width-70 center-transform title font-size-20 enemy-title-font">{{$t(name)}}</span>

    <div class="flex full-flex width-100 height-100">
      <div class="flex-basis-50 relative">
        <div class="current-raid-image pixelated" :style="raidImage"></div>

        <progress-bar
          v-if="!raidData.finished"
          class="raid-progress"
          :percentMode="true"
          :maxValue="progress.max"
          :value="progress.current"
          valueClass="white-font font-outline"
          valuePosition="top"
          height="0.5rem"
          barType="yellow"
          :thresholds="thresholds"
        ></progress-bar>
      </div>

      <div class="flex-basis-50 flex flex-column flex-item-center flex-end" v-if="!finished">
        <span class="font-size-18">
          {{$t("time-left")}}:
          <span class="enemy-title-font">{{timer.value}}</span>
        </span>
        <custom-button class="margin-top-half" type="grey" @click="viewRaid">{{$t("continue")}}</custom-button>
      </div>

      <div class="flex-basis-50 flex flex-column flex-item-center flex-end" v-else>
        <custom-button type="green" @click="claimReward">{{$t("claim-reward")}}</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
const RaidsMeta = require("@/raids_meta.json");
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer.js";

import { create as CreateDialog } from "vue-modal-dialogs";
import ClaimedReward from "./ClaimedReward.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Campaign from "@/campaign_database";

const ShowReward = CreateDialog(ClaimedReward, ...ClaimedReward.props);

export default {
  props: ["raidData"],
  components: { CustomButton, ProgressBar },
  data: () => ({
    timer: new Timer(true),
    thresholds: UiConstants.progressThresholds
  }),
  mounted() {
    this.updateTimerValue();
  },
  watch: {
    raidData() {
      this.updateTimerValue();
    }
  },
  computed: {
    meta() {
      return RaidsMeta[this.raidData.raidTemplateId] || {};
    },
    name() {
      return this.meta.name;
    },
    finished() {
      return this.raidData.finished;
    },
    raidImage() {
      return UiConstants.backgroundImage(
        Campaign.getRaidImage(this.raidData.raidTemplateId)
      );
    },
    progress() {
      return {
        current: this.raidData.bossState.health,
        max: this.meta.stages[this.raidData.stage].health
      };
    }
  },
  methods: {
    viewRaid() {
      this.$router.push({
        name: "view-raid",
        params: { raid: this.raidData.id }
      });
    },
    updateTimerValue() {
      this.timer.timeLeft = this.raidData.timeLeft;
      this.timer.update();
    },
    async claimReward() {
      let rewards = await this.$game.claimRaidLoot(this.raidData.id);
      await ShowReward(rewards.response, this.raidData.raidTemplateId);
      this.$emit("claimed");
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
  z-index: 1;
}

.current-raid-image {
  flex: 1 1;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.raid-progress {
  position: absolute;
  bottom: 0;
}
</style>


