<template>
  <div class="mission-element flex flex-column flex-no-wrap flex-items-center">
    <Title :stackBottom="true">{{ $t(missionName) }}</Title>
    <div
      class="width-100 height-100 flex color-panel-2 stacked-bottom stacked-top"
    >
      <div
        class="left-column flex flex-column flex-center flex-5 margin-right-1"
      >
        <div class="mission-image" :style="enemyImage"></div>

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

      <div
        class="flex-5 font-size-18 right-column flex-column flex-item-center"
      >
        <div class="info flex margin-top-small">
          <div class="flex-2 flex flex-column flex-items-start">
            <div
              class="margin-bottom-small yellow-title margin-bottom-2 font-outline font-weight-900"
            >
              {{ $t("rew") }}
            </div>
            <div class="flex flex-column digit-font font-outline">
              <icon-with-value
                class="flex-start"
                iconClass="icon-exp small"
                :value="exp"
                valueClass="info-font"
              ></icon-with-value>
              <icon-with-value
                class="flex-start"
                iconClass="icon-gold small"
                :value="goldValue"
                valueClass="info-font"
              ></icon-with-value>

              <icon-with-value
                v-if="quest.energy > 0"
                iconClass="icon-energy small"
                :value="quest.energy"
                valueClass="info-font"
              ></icon-with-value>
            </div>
          </div>
        </div>

        <div
          class="yellow-title font-size-20 flex-basis-50"
          v-if="!isBossUnlocked"
        >
          <div class="center-transform-vertical font-outline">
            {{ $t("f-prev-q") }}
          </div>
        </div>

        <div
          class="green-title font-size-30 flex-basis-50"
          v-else-if="progress.current >= progress.max"
        >
          <div class="center-transform-vertical font-outline">Complete</div>
        </div>

        <custom-button
          size="small"
          v-else
          @click="$emit('engage')"
          :id="`quest-${questIndex}`"
          >{{ $t("btn-s-q") }}</custom-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import QuestGetterMixin from "./QuestGetterMixin.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import UiConstants from "@/ui_constants";
import Zones from "@/campaign_database";
import Title from "@/components/Title.vue";

export default {
  mixins: [QuestGetterMixin],
  components: {
    ProgressBar,
    IconWithValue,
    CustomButton,
    Title
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

      let bossUnlocked = true;

      for (let i = 0; i < this.questIndex; ++i) {
        const qProgress = this.$game.getQuestProgress(this.zone._id, i);

        if (qProgress.current < qProgress.max) {
          bossUnlocked = false;
          break;
        }
      }
      return bossUnlocked;
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

@panelHeight: 24rem;

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
  height: @panelHeight;
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
