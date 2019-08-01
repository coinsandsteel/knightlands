<template>
  <div class="mission-element panel">
    <div class="left-column flex flex-column flex-center flex-basis-50">
      <div class="title flex flex-center font-size-20 enemy-title-font">
        <span>{{view.name}}</span>
      </div>

      <div class="mission-image pixelated" :style="enemyImage()"></div>

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

    <div class="flex-basis-50 font-size-18 right-column flex-column flex-item-center">
      <div class="info flex margin-top-small">
        <div class="flex-basis-50">
          <div class="margin-bottom-small yellow-title text-align-left">Rewards</div>
          <div class="list digit-font font-outline">
            <icon-with-value
              iconClass="icon-exp icon-size-mini"
              :value="quest.exp"
              valueClass="info-font "
            ></icon-with-value>
            <icon-with-value
              iconClass="icon-gold icon-size-mini"
              :value="`${quest.goldMin}-${quest.goldMax}`"
              valueClass="info-font"
            ></icon-with-value>
          </div>
        </div>
        <div class="flex-basis-50" v-show="quest.energy > 0">
          <div class="margin-bottom-small blue-title text-align-left">Cost</div>
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
import ZoneViews from "@/zone_views";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import UiConstants from "@/ui_constants";

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
    view() {
      if (!ZoneViews[this.zone._id]) return {};
      return ZoneViews[this.zone._id].quests[this.questIndex] || {};
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
    }
  },
  methods: {
    enemyImage() {
      return `background-image: url("/images/enemies/${this.view.img}.png");`;
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
