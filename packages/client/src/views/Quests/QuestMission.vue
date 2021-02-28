<template>
  <div class="flex flex-column flex-center">
    <div
      class="flex flex-center flex-column font-outline font-size-30 enemy-title"
    >
      <span
        class="rarity-mythical font-weight-900 font-outline"
        v-show="isBoss"
        >{{ $t("q-boss") }}</span
      >
      <div>
        <span class="enemy-title-font">{{ $t(missionName) }}</span>
      </div>
    </div>

    <div
      :style="zoneBackground"
      class="flex quest-mid relative flex-center flex-no-wrap"
    >
      <div
        :class="{ hidden: questIndex <= 0 }"
        class="quest-nav flex flex-item-center pointer padding-left-2"
        @click="goToPrev"
      >
        <div class="nav-arrow left"></div>
      </div>

      <slider
        ref="slider"
        animation="fade"
        :touch="true"
        :control-btn="false"
        :indicators="false"
        :autoplay="false"
        width="100%"
        height="100%"
        v-model="sliderIndex"
        @change="handleEnemyChanged($event)"
      >
        <slider-item class="flex" v-for="index in enemyList" :key="index">
          <div class="quest-image flex flex-column flex-center flex-end">
            <img ref="enemyView" :src="enemyImage(index)" />
          </div>
        </slider-item>
      </slider>

      <div
        :class="{ hidden: questIndex >= maxQuestIndex }"
        class="quest-nav right flex flex-item-center pointer padding-right-2"
        @click="goToNext"
      >
        <div class="nav-arrow"></div>
      </div>

      <div class="absolute-stretch z-index-100 pointer-events-none">
        <DamageText
          v-for="damage in playerDamages"
          :local="true"
          :key="damage.id"
          :crit="damage.crit"
          >{{ damage.damage }}</DamageText
        >
        <NewLoot
          v-for="reward in newRewards"
          :key="reward.id"
          :item="reward"
          :delay="reward.delay"
        >
        </NewLoot>
      </div>
    </div>

    <div class="color-panel-1 flex flex-column full-flex">
      <progress-bar
        :percentMode="!isBoss"
        v-model="currentProgress"
        :maxValue="maxProgress"
        height="0.75rem"
        width="80%"
        valuePosition="top"
        barType="yellow"
        valueClass="white-font font-outline font-size-30 quest-progress-value"
        :thresholds="thresholds"
      ></progress-bar>

      <div class="flex margin-top-2">
        <div
          class="width-50 font-size-25 flex flex-column flex-center flex-justify-start"
        >
          <span class="margin-bottom-1 yellow-title font-weight-900">{{
            $t("rewards")
          }}</span>
          <div class="flex flex-column flex-start">
            <icon-with-value
              class="flex-start margin-bottom-half"
              iconClass="icon-exp"
              :value="exp"
            ></icon-with-value>
            <icon-with-value
              class="flex-start"
              iconClass="icon-gold"
              :value="goldValue"
            ></icon-with-value>
          </div>
        </div>
        <div
          class="width-50 font-size-25 flex flex-column flex-center flex-justify-start"
          v-show="quest.energy"
        >
          <span class="margin-bottom-1 blue-title font-weight-900">Cost</span>
          <div class="flex flex-column">
            <icon-with-value
              class="flex-start"
              iconClass="icon-energy"
              :value="quest.energy"
            ></icon-with-value>
          </div>
        </div>
      </div>

      <div class="margin-top-1 flex flex-center">
        <div
          v-if="!isBossUnlocked"
          class="font-size-30 grey-title font-outline"
        >
          {{ $t("clear-quests") }}
        </div>

        <div v-else-if="progress.current >= progress.max && hasNextZone">
          <CustomButton type="yellow" @click="goToNextMission">{{
            $t("btn-next-quest")
          }}</CustomButton>
        </div>

        <div v-else class="flex flex-center width-100 flex-space-evenly">
          <AttackButton
            :promise="request"
            @click="engage(false)"
            id="engage-q"
            >{{ isBoss ? $t("q-att-s") : $t("q-prog-s") }}</AttackButton
          >
          <PromisedButton
            :promise="request"
            :locked="!hasFastQuests"
            @click="engage(true)"
            >{{ isBoss ? $t("q-att-m") : $t("q-prog-m") }}</PromisedButton
          >
        </div>
      </div>
    </div>

    <Title class="margin-top-2">{{ $t("loot") }}</Title>

    <div class="flex full-flex padding-left-1 padding-right-1 margin-top-1">
      <loot
        v-for="reward in rewards"
        :key="reward.id"
        :item="reward"
        @hint="handleHint"
      ></loot>
    </div>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import Zones from "@/campaign_database";
import ProgressBar from "@/components/ProgressBar.vue";
import Loot from "@/components/Loot.vue";
import Stat from "@/../../knightlands-shared/character_stat.js";
import IconWithValue from "@/components/IconWithValue.vue";
import UiConstants from "@/ui_constants";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import AttackButton from "@/components/AttackButton.vue";
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import NewLoot from "@/components/Item/NewLoot.vue";
import DamageText from "@/views/Raids/DamageText.vue";
import Errors from "@/../../knightlands-shared/errors";
import QuestGetterMixin from "./QuestGetterMixin.vue";

import { create } from "vue-modal-dialogs";
import NotEnoughResource from "@/components/Modals/NotEnoughResource.vue";

const ShowResourceRefill = create(NotEnoughResource, "stat");

import anime from "animejs/lib/anime.es.js";

const NEW_LOOT_DELAY = 300;
const DAMAGE_DELAY = 200;

export default {
  name: "quest-mission",
  mixins: [HintHandler, NetworkRequestErrorMixin, QuestGetterMixin],
  props: ["zone", "questIndex", "maxQuestIndex", "stage"],
  components: {
    Loot,
    ProgressBar,
    IconWithValue,
    PromisedButton,
    CustomButton,
    DamageText,
    AttackButton,
    Title,
    NewLoot
  },
  data() {
    return {
      rewards: [],
      thresholds: UiConstants.progressThresholds,
      lootHash: {},
      request: null,
      playerDamages: [],
      newRewards: [],
      sliderIndex: 0
    };
  },
  mounted() {
    this.damageTextId = 0;

    this.sliderIndex = +this.questIndex;
  },
  activated() {
    this.$refs.slider.af = null;
    this.$refs.slider.initTouchArea();
    this.sliderIndex = +this.questIndex;
  },
  deactivated() {
    this.rewards = [];
    this.newRewards = [];
    this.lootHash = {};
  },
  computed: {
    maxProgress() {
      return this.progress.max;
    },
    currentProgress() {
      return this.isBoss
        ? this.progress.max - this.progress.current
        : this.progress.current;
    },
    enemyList() {
      return [0, 1, 2, 3, 4, 5];
    },
    isBoss() {
      return this.questIndex == 5;
    },
    progress() {
      return this.$game.getQuestProgress(this.zone._id, this.questIndex);
    },
    zoneBackground() {
      return UiConstants.backgroundImage(Zones.getBackground(this.zone._id));
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
    missionName() {
      return Zones.getMissionName(this.zone._id, this.questIndex);
    },
    hasNextZone() {
      return !Zones.isLastZone(this.zone._id);
    }
  },
  methods: {
    goToNextMission() {
      // find next unfinished quest
      let i = 0;
      const l = this.enemyList.length;
      for (; i < l; ++i) {
        let index = this.enemyList[i];
        let progress = this.$game.getQuestProgress(this.zone._id, index);
        if (progress.current < progress.max) {
          this.sliderIndex = index;
          return;
        }
      }

      this.$router.replace({
        name: "quests",
        params: {
          zone: this.zone._id + 1
        }
      });
    },
    goToNext() {
      this.sliderIndex++;
    },
    goToPrev() {
      this.sliderIndex--;
    },
    handleEnemyChanged(slideIndex) {
      let questIndex = this.enemyList[slideIndex];
      if (this.questIndex == questIndex) {
        return;
      }

      this.$router.replace({
        name: "quests",
        params: {
          zone: this.zone._id,
          quest: questIndex
        }
      });
    },
    enemyImage(questIndex) {
      return Zones.getEnemyImage(this.zone._id, questIndex);
    },
    async engage(max, boss) {
      this.request = this.performRequestNoCatch(
        this.$game.engageQuest(this.zone._id * 1, this.questIndex * 1, max)
      );
      try {
        let { damages, items } = await this.request;
        let totalDamage = 0;
        let isCrit = false;
        for (let i = 0; i < damages.length; ++i) {
          isCrit |= damages[i].crit;
          totalDamage += damages[i].damage;
        }

        if (totalDamage > 0) {
          this.handleDamage(totalDamage, isCrit, 0);
        }

        this.handleLoot(items);
      } catch (exc) {
        await this._handleQuestError(exc);
      }
    },
    handleLoot(lootDrop) {
      let delay = 0;
      for (let loot of lootDrop) {
        const templateId = loot.item;
        // if already was dropped before - just inc loot counter
        if (this.lootHash[templateId]) {
          this.lootHash[templateId].count += loot.quantity;
        } else {
          // or add to loot array and hash for tracking
          this.$set(this.lootHash, templateId, {
            template: loot.item,
            count: loot.quantity
          });
          this.rewards.push(this.lootHash[templateId]);
        }

        this.showNewLoot(loot, delay);
        delay += NEW_LOOT_DELAY;
      }
    },
    async _handleQuestError(error) {
      switch (error) {
        case Errors.NoHealth:
          await ShowResourceRefill(Stat.Health);
          break;

        case Errors.NoEnergy:
          await ShowResourceRefill(Stat.Energy);
          break;
      }
    },
    showNewLoot(loot, delay) {
      setTimeout(() => {
        this.newRewards.splice(0, 1);
      }, 3000);

      this.newRewards.push({
        template: loot.item,
        count: loot.quantity,
        delay
      });
    },
    handleDamage(damage, crit, delay) {
      this.playerDamages.push({
        damage: damage,
        crit: crit,
        id: this.damageTextId++
      });

      setTimeout(() => {
        this.playerDamages.splice(0, 1);
      }, 3000);

      const enemyView = this.$refs.enemyView[this.questIndex];
      anime.remove(enemyView);
      let timeline = anime.timeline({
        targets: enemyView
      });

      if (crit) {
        timeline.add({
          translateX: function(el, i) {
            return `-=${anime.random(-1, -2)}rem`;
          },
          translateY: function(el, i) {
            return `-=${anime.random(-1, 1)}rem`;
          },
          scale: 1.2 + Math.random() * 0.2,
          duration: 0,
          loop: 1
        });
      }

      timeline.add(
        {
          filter: "brightness(100)",
          duration: 0
        },
        0
      );

      timeline.add({
        translateX: 0,
        translateY: 0,
        scale: 1,
        delay: delay,
        filter: {
          value: "brightness(1)",
          easing: "linear",
          duration: 100
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.quest-mid {
  width: 100%;
  height: 30vh;
  min-height: 30vh;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 1rem;
}

.quest-enemies {
  height: 80%;
  width: 100%;
}

.quest-image {
  width: 100vw;
  padding-bottom: 1rem;
  height: 100%;

  & img {
    max-width: 100%;
    max-height: 100%;
  }
}

.quest-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}

.enemy-title {
  padding: 1rem;
  background-color: #0d00287d;
  border-radius: 2px;
  position: absolute;
  top: 0;
  z-index: 100;
}

.hidden {
  display: none;
}

.quest-nav {
  left: 0;
  position: absolute;
  z-index: 100;
  height: 14rem;
  transition: all 0.2s ease;

  &.right {
    left: unset;
    right: 0;
  }
}
</style>
