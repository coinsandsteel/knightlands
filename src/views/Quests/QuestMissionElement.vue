<template>
  <div class="mission-element panel">
    <div class="left-column flex flex-column flex-center flex-5 margin-right-1">
      <div class="mission-title width-100 title flex flex-center font-size-18 enemy-title-font">
        <span>{{$t(missionName)}}</span>
      </div>

      <div class="mission-image pixelated margin-top-2" :style="enemyImage"></div>

      <progress-bar
        class="mission-progress"
        ref="progress"
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

    <div class="flex-5 font-size-18 right-column flex-column flex-item-center">
      <div class="info flex margin-top-small">
        <div class="flex-3 flex flex-column flex-items-start">
          <div class="margin-bottom-small yellow-title margin-bottom-half">Rewards</div>
          <div class="list digit-font font-outline">
            <icon-with-value
              class="flex-start"
              iconClass="icon-exp icon-size-mini"
              :value="quest.exp"
              valueClass="info-font"
            ></icon-with-value>
            <icon-with-value
              class="flex-start"
              iconClass="icon-gold icon-size-mini"
              :value="`${quest.goldMin}-${quest.goldMax}`"
              valueClass="info-font"
            ></icon-with-value>
          </div>
        </div>
        <div class="flex-1  flex flex-column flex-items-start" v-show="quest.energy > 0">
          <div class="margin-bottom-small blue-title margin-bottom-half">Cost</div>
          <div class="list digit-font font-outline">
            <icon-with-value
              iconClass="icon-energy icon-size-mini"
              :value="quest.energy"
              valueClass="info-font"
            ></icon-with-value>
          </div>
        </div>
      </div>

      <div class="grey-title font-size-20 flex-basis-50" v-if="!isBossUnlocked">
        <div class="center-transform-vertical font-outline">Kill previous enemies</div>
      </div>

      <div
        class="green-title font-size-30 flex-basis-50"
        v-else-if="progress.current >= progress.max"
      >
        <div class="center-transform-vertical font-outline">Complete</div>
      </div>

      <custom-button size="small" v-else @click="$emit('engage')">Engage</custom-button>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import UiConstants from "@/ui_constants";
import Zones from "@/campaign_database";

export default {
  components: {
    ProgressBar,
    IconWithValue,
    CustomButton
  },
  props: {
    zone: {
      type: Object
    },
    questIndex: {
      type: Number
    },
    stage: {
      type: Number,
      default: 0
    },
    lockedReason: {
      type: String
    }
  },
  data() {
    return {
      thresholds: UiConstants.progressThresholds
    };
  },
  computed: {
    progress() {
      return this.$game.getQuestProgress(this.zone._id, this.questIndex);
    },
    missionName() {
      return Zones.getMissionName(this.zone._id, this.questIndex);
    },
    quest() {
      return this.zone.quests[this.questIndex].stages[this.stage];
    },
    isBossUnlocked() {
      if (!this.zone.quests[this.questIndex].boss) {
        return true;
      }

      let bossProgress = this.$game.getQuestBossProgress(
        this.zone._id,
        this.stage
      );
      return bossProgress.unlocked;
    },
    enemyImage() {
      return UiConstants.backgroundImage(
        Zones.getEnemyImage(this.zone._id, this.questIndex)
      );
    }
  }
};
</script>

<style lang="less">
.info-font {
  font-size: 1em;
}
</style>


<style lang="less" scoped>
@import (reference) "../../style/common.less";

@panelHeight: 12.875rem;

.mission-progress {
  width: 90% !important;
}

.mission-title {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.mission-element {
  width: 100%;
  height: @panelHeight;
  display: flex;
  box-sizing: border-box;
  margin-bottom: 1vh;
  padding-bottom: 0.1rem;

  .left-column {
    position: relative;

    img {
      position: relative;
      top: 0;
      max-height: 100%;
      object-fit: contain;
    }
  }

  .right-column {
    position: relative;
    display: flex;
    flex-direction: column;

    .info {
      width: 100%;
      flex: 1 1;
    }
  }
}

.mission-image {
  flex: 1 1;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.icon-value {
  display: flex;
  align-items: center;

  .icon {
    font-size: 8px;
    width: 16px;
    line-height: 16px;
    margin-right: 10px;
  }
}
</style>
