<template>
  <div class="flex flex-column flex-center">
    <div class="flex flex-center flex-column font-outline font-size-30 enemy-title">
      <span class="rarity-mythical font-weight-700" v-show="isBoss">BOSS</span>
      <div class="enemy-title-font">
        {{$t(missionName)}}
      </div>
    </div>

    <div :style="zoneBackground" class="flex quest-mid relative flex-center flex-no-wrap">
      <div
        :class="{hidden: questIndex <= 0}"
        class="quest-nav flex flex-item-center"
        @click="goToPrev"
      >
        <div class="nav-arrow left"></div>
      </div>

      <agile
        ref="enemyList"
        :dots="false"
        :navButtons="false"
        :centerMode="true"
        :speed="300"
        :infinite="false"
        class="pixelated quest-enemies width-100"
        @afterChange="handleEnemyChanged($event)"
      >
        <div
          v-for="index in enemyList"
          :key="index"
          class="quest-image flex flex-column flex-center flex-end"
        >
          <img ref="enemyView" :src="enemyImage(index)" />
        </div>
      </agile>

      <div
        :class="{hidden: questIndex >= maxQuestIndex}"
        class="quest-nav right flex flex-item-center"
        @click="goToNext"
      >
        <div class="nav-arrow"></div>
      </div>

      <div class="absolute-stretch z-index-1 pointer-events-none">
        <DamageText
              v-for="(damage) in playerDamages"
              :key="damage.id"
              :crit="damage.crit"
            >{{damage.damage}}</DamageText>
      </div>
    </div>

    <progress-bar
      :percentMode="true"
      v-model="progress.current"
      :maxValue="progress.max"
      height="0.75rem"
      width="80%"
      valuePosition="top"
      barType="yellow"
      valueClass="white-font font-outline font-size-30 quest-progress-value"
      :thresholds="thresholds"
    ></progress-bar>

    <div class="quest-bottom panel flex flex-column full-flex">
      <div class="flex quest-info-table">
        <div class="flex-basis-50 font-size-25 flex flex-column flex-center flex-justify-start">
          <div>Rewards</div>
          <div class="margin-top-small">
            <icon-with-value iconClass="icon-exp" :value="quest.exp"></icon-with-value>
            <icon-with-value iconClass="icon-gold" :value="`${quest.goldMin}-${quest.goldMax}`"></icon-with-value>
          </div>
        </div>
        <div
          class="flex-basis-50 font-size-25 flex flex-column flex-center flex-justify-start"
          v-show="quest.energy"
        >
          <div>Cost</div>
          <div class="margin-top-small">
            <icon-with-value iconClass="icon-energy" :value="quest.energy"></icon-with-value>
          </div>
        </div>
      </div>

      <div class="flex full-flex padding-left-2 padding-right-2">
        <loot v-for="reward in rewards" :key="reward.id" :item="reward" @hint="handleHint"></loot>
      </div>
    </div>
    <div class="quest-footer flex flex-center">
      <div v-if="!isBossUnlocked" class="font-size-30 grey-title font-outline">Kill previous enemies</div>

      <div v-else-if="progress.current >= progress.max && hasNextZone">
        <CustomButton type="yellow" @click="goToNextMission">{{$t("btn-next-quest")}}</CustomButton>
      </div>

      <div v-else class="flex flex-center width-100 flex-space-evenly">
        <PromisedButton :promise="request" @click="engage(false)" :props='{width: "15rem"}'>Attack x1</PromisedButton>
        <PromisedButton :promise="request" :locked="!$game.hasPremiumAccount" @click="engage(true)" :props='{width: "15rem"}'>Attack MAX</PromisedButton>
      </div>
    </div>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import Zones from "@/campaign_database";
import LoadingScreen from "@/components/LoadingScreen.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import Loot from "@/components/Loot.vue";
const ItemType = require("@/../knightlands-shared/item_type");
import Stat from "@/../knightlands-shared/character_stat.js";
import IconWithValue from "@/components/IconWithValue.vue";
import UiConstants from "@/ui_constants";
import Inventory from "@/inventory";
import PromisedButton from "@/components/PromisedButton.vue";
import CustomButton from "@/components/Button.vue";
import DamageText from "@/views/Raids/DamageText.vue";
const Events = require("@/../knightlands-shared/events");
import Errors from "@/../knightlands-shared/errors";

import { create } from "vue-modal-dialogs";
import NotEnoughResource from "@/components/Modals/NotEnoughResource.vue";

const ShowResourceRefill = create(
  NotEnoughResource,
  ...NotEnoughResource.props
);

import anime from "animejs/lib/anime.es.js";

export default {
  name: "quest-mission",
  mixins: [HintHandler],
  props: ["zone", "questIndex", "maxQuestIndex", "stage"],
  components: {
    LoadingScreen,
    Loot,
    ProgressBar,
    IconWithValue,
    PromisedButton,
    CustomButton,
    DamageText
  },
  data() {
    return {
      rewards: [],
      thresholds: UiConstants.progressThresholds,
      lootHash: {},
      request: null,
      playerDamages: []
    };
  },
  created() {
    this.handleInventoryCallback = this.handleInventoryDelta.bind(this);
  },
  mounted() {
    this.damageTextId = 0;

    this.$game.inventory.on(
      Inventory.Changed,
      this.handleInventoryCallback
    );

    this.$refs.enemyList.goTo(this.questIndex * 1);
  },
  activated() {
    this.$game.inventory.on(
      Inventory.Changed,
      this.handleInventoryCallback
    );

    this.$refs.enemyList.goTo(this.questIndex);
  },
  destroyed() {
    this.$game.inventory.off(Inventory.Changed, this.handleInventoryCallback);
  },
  deactivated() {
    this.$game.inventory.off(Inventory.Changed, this.handleInventoryCallback);
    this.rewards = [];
    this.lootHash = {};
  },
  computed: {
    enemyList() {
      return [0, 1, 2, 3, 4, 5];
    },
    isBoss() {
      return this.questIndex == 5;
    },
    progress() {
      return this.$game.getQuestProgress(this.zone._id, this.questIndex);
    },
    quest() {
      return this.zone.quests[this.questIndex].stages[this.stage];
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
          this.$refs.enemyList.goTo(index);
          return;
        }
      }

      this.$router.replace({name: "quests", params: {
        zone: this.zone._id + 1
      }});
    },
    goToNext() {
      this.$refs.enemyList.goToNext();
    },
    goToPrev() {
      this.$refs.enemyList.goToPrev();
    },
    handleEnemyChanged(event) {
      let questIndex = this.enemyList[event.currentSlide];
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
      this.request = this.$game.engageQuest(
        this.zone._id * 1,
        this.questIndex * 1,
        max
      );

      try {
        let damages = await this.request;
        let delay = 0;
        for (let i = 0; i < damages.length; ++i) {
          this.handleDamage(damages[i].damage, damages[i].crit, delay);
          delay += 150;
        }
        
      } catch (exc) {
        await this._handleQuestError(exc);
      }
    },
    handleInventoryDelta(lootDrops) {
      for (let itemId in lootDrops.changes) {
        // if already was dropped before - just inc loot counter
        if (this.lootHash[itemId]) {
          this.lootHash[itemId].count += lootDrops.delta[itemId];
        } else if (lootDrops.changes[itemId]) {
          // or add to loot array and hash for tracking
          let copy = { ...lootDrops.changes[itemId] };
          copy.count = lootDrops.delta[itemId];
          this.$set(this.lootHash, itemId, copy);
          this.rewards.push(this.lootHash[itemId]);
        }
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
        filter: {
          value: "brightness(1)",
          easeing: "",
          duration: 100
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.agile__slide {
  display: flex;
}

.stamina-buttons {
  padding: 0.5rem;
  * > {
    margin: 0.5rem;
  }
}

.quest-mid {
  width: 100%;
  height: 30vh;
  min-height: 10vh;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 1rem;

  .quest-nav:first-child {
    padding-left: 1rem;
  }

  .quest-nav:last-child {
    padding-right: 1rem;
  }
}

.quest-footer {
  width: 100%;
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

.quest-bottom {
  width: calc(100% - 3rem);
  margin: 1.5rem;
  padding-bottom: 0.5rem;
}

.quest-info-table {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem;
}

.quest-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.enemy-title {
  position: absolute;
  top: 0;
  z-index: 1;
}

.hidden {
  opacity: 0;
}

.quest-nav {
  left: 0;
  position: absolute;
  z-index: 2;
  cursor: pointer;
  height: 14rem;
  transition: all 0.2s ease;

  &.right {
    left: unset;
    right: 0;
  }
}
</style>


