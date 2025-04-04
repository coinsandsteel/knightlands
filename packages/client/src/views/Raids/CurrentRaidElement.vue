<template>
  <div class="color-panel-2 current-raid-cell flex flex-column">
    <Title titleClass="font-weight-700 enemy-title-font"
      >{{ $t(raidName) }} {{ $t("unit-lvl", { lvl: raidLevel }) }}</Title
    >

    <div class="flex full-flex width-100">
      <div
        class="flex-basis-50 relative flex flex-column flex-no-wrap font-outline font-weight-900"
      >
        <div class="current-raid-image full-flex" :style="raidImage"></div>
        <div class="weakness flex flex-column" v-if="!isFreeRaid">
          <IconWithValue :iconClass="`icon-${weakness.element}`">{{
            $t(`el-${weakness.element}`)
          }}</IconWithValue>
          <!-- <IconWithValue class="margin-top-1" iconClass="icon-attack">{{
            $t(weakness.weapon)
          }}</IconWithValue> -->
          <IconWithValue
            class="margin-top-1 current-raid-weapon"
            :iconClass="`unit_weapon_${weakness.weapon}`"
          >
            <span class="margin-left-half">{{ $t(weakness.weapon) }}</span>
          </IconWithValue>
        </div>

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

      <div
        class="flex-basis-50 flex flex-column flex-item-center flex-end"
        v-if="!finished"
      >
        <span class="font-size-20 margin-bottom-1" v-if="!isFreeRaid">{{
          $t("raid_slots", { s: slots, m: maxSlots })
        }}</span>
        <span class="font-size-20">
          {{ $t("time-left") }}
          <span class="enemy-title-font">{{ timer.value }}</span>
        </span>
        <custom-button
          class="margin-top-half"
          type="grey"
          :disabled="join && !canSummonCurrentRaid"
          @click="viewRaid"
          minWidth="20rem"
          >{{ join ? $t("join") : $t("continue") }}</custom-button
        >
      </div>

      <div
        class="flex-basis-50 flex flex-column flex-item-center flex-end"
        v-else
      >
        <custom-button type="green" @click="claimReward">{{
          $t("claim-reward")
        }}</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import Timer from "@/timer.js";

import { create as CreateDialog } from "vue-modal-dialogs";
import ClaimedReward from "./ClaimedReward.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import IconWithValue from "@/components/IconWithValue.vue";

import RaidGetterMixin from "./RaidGetterMixin.vue";

const ShowReward = CreateDialog(ClaimedReward, "rewards", "raidTemplateId");

export default {
  props: ["raidState", "join"],
  mixins: [RaidGetterMixin],
  components: { CustomButton, IconWithValue, ProgressBar, Title },
  data: () => ({
    timer: new Timer(true),
    thresholds: UiConstants.progressThresholds,
    raid: -1
  }),
  watch: {
    raidData: {
      immediate: true,
      handler() {
        this.updateTimerValue();
        this.raid = this.raidState.raidTemplateId;
      }
    }
  },
  computed: {
    ...mapGetters("raids", ["canSummonCurrentRaid"]),
    weakness() {
      return this.raidState.weakness.current;
    },
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
    },
    slots() {
      return Object.keys(this.raidState.participants).length;
    }
  },
  methods: {
    viewRaid() {
      this.$router.push({
        name: "view-raid",
        params: { raidId: this.raidState.id }
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
@panelHeight: 200px;

.current-raid-cell {
  height: @panelHeight;
  position: relative;
}

.current-raid-image {
  white-space: nowrap;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.weakness {
  position: absolute;
  top: 0;
  left: 1rem;
}
.current-raid-weapon::v-deep .value-icon {
  width: 2.5rem;
  height: 2.5rem;
}

// .raid-progress {
//   position: absolute;
//   bottom: 0;
// }
</style>
