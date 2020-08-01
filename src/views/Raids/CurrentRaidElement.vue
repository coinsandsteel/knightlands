<template>
  <div class="full-flex color-panel-2 current-raid-cell">
    <Title class="font-size-18 enemy-title-font">{{$t(raidName)}}</Title>

    <div class="flex full-flex width-100 height-100">
      <div class="flex-basis-50 relative">
        <div class="current-raid-image" :style="raidImage"></div>

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
        <span class="font-size-18 span-whitespace">
          {{$t("time-left")}}
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
import Title from "@/components/Title.vue";
import Timer from "@/timer.js";

import { create as CreateDialog } from "vue-modal-dialogs";
import ClaimedReward from "./ClaimedReward.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Campaign from "@/campaign_database";

import RaidGetterMixin from "./RaidGetterMixin.vue";

const ShowReward = CreateDialog(ClaimedReward, ...ClaimedReward.props);

export default {
  props: ["raidState"],
  mixins: [RaidGetterMixin],
  components: { CustomButton, ProgressBar, Title },
  data: () => ({
    timer: new Timer(true),
    thresholds: UiConstants.progressThresholds,
    raid: -1
  }),
  mounted() {
    this.updateTimerValue();
    this.raid = this.raidState.raidTemplateId;
  },
  watch: {
    raidData() {
      this.updateTimerValue();
      this.raid = this.raidState.raidTemplateId;
    }
  },
  computed: {
    finished() {
      return this.raidState.finished;
    },
    isFreeRaid() {
      return this.raidState.isFree;
    },
    progress() {
      return {
        current: this.raidState.bossState.health,
        max: this.raidMaxHealth
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
      this.timer.timeLeft = this.raidState.timeLeft;
      this.timer.update();
    },
    async claimReward() {
      let rewards = await this.$game.claimRaidLoot(this.raidState.id);
      await ShowReward(rewards.response, this.raid);
      this.$emit("claimed");
    }
  }
};
</script>

<style lang="less" scoped>
@panelHeight: 12.875rem;

.current-raid-cell {
  // height: @panelHeight;
  position: relative;
}

.current-raid-image {
  white-space: nowrap;
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


