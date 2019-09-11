<template>
  <Promised :promise="request">
    <template v-slot:combined="{isPending, isDelayOver, data}">
      <div class="flex flex-column flex-center">
        <LoadingScreen :loading="true" v-show="isPending && isDelayOver"></LoadingScreen>

        <div class="font-size-30 enemy-title-font font-outline font-weight-700">{{$t(missionName)}}</div>

        <div :style="zoneBackground" class="flex quest-mid flex-center flex-no-wrap">
          <div
            :class="{hidden: questIndex <= 0}"
            class="quest-nav flex flex-item-center"
            @click="$emit('prevQuest')"
          >
            <div class="nav-arrow left"></div>
          </div>

          <!-- ENEMY IMAGE HERE -->
          <div class="quest-image pixelated flex flex-items-end flex-center">
            <img :src="enemyImage" />
          </div>

          <div
            :class="{hidden: questIndex >= maxQuestIndex}"
            class="quest-nav flex flex-item-center"
            @click="$emit('nextQuest')"
          >
            <div class="nav-arrow"></div>
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

          <div class="flex flex-center full-flex loot ">
            <loot v-for="reward in rewards" :key="reward.id" :item="reward" @hint="handleHint"></loot>
          </div>
        </div>
        <div class="quest-footer flex flex-center">
          <div v-if="!isBossUnlocked" class="font-size-30 grey-title font-outline">Kill previous enemies</div>
          <div v-else-if="progress.current >= progress.max">
            <div class="font-size-30 font-outline green-title">Complete</div>
          </div>
          <div v-else class="flex flex-center width-100 flex-space-evenly">
            <custom-button @click="engage(false)">Attack x1</custom-button>
            <custom-button :locked="!$game.hasPremiumAccount" @click="engage(true)">Attack MAX</custom-button>
          </div>
        </div>
      </div>
    </template>
  </Promised>
  
</template>

<script>
import HintHandler from "@/components/HintHandler.vue"
import Zones from "@/campaign_database";
import LoadingScreen from "@/components/LoadingScreen.vue"
import ProgressBar from "@/components/ProgressBar.vue";
import Loot from "@/components/Loot.vue";
const ItemType = require("@/../knightlands-shared/item_type");
import Stat from "@/../knightlands-shared/character_stat.js";
import IconWithValue from "@/components/IconWithValue.vue";
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";
import Inventory from "@/inventory";

const Events = require("@/../knightlands-shared/events");
import Errors from "@/../knightlands-shared/errors";

import { create } from "vue-modal-dialogs";
import NotEnoughResource from "@/components/Modals/NotEnoughResource.vue";

import { Promised } from "vue-promised";

const ShowResourceRefill = create(
  NotEnoughResource,
  ...NotEnoughResource.props
);

export default {
  name: "quest-mission",
  mixins: [HintHandler],
  props: ["zone", "questIndex", "maxQuestIndex", "stage"],
  components: { LoadingScreen, Loot, ProgressBar, IconWithValue, CustomButton, Promised },
  data() {
    return {
      rewards: [],
      thresholds: UiConstants.progressThresholds,
      lootHash: {},
      request: null
    };
  },
  mounted() {
    this.$game.inventory.on(
      Inventory.Changed,
      this.handleInventoryDelta.bind(this)
    );
  },
  destroyed() {
    this.$game.inventory.off(Inventory.Changed);
  },
  deactivated() {
    this.rewards = [];
    this.lootHash = {};
  },
  computed: {
    progress() {
      return this.$game.getQuestProgress(this.zone._id, this.questIndex);
    },
    quest() {
      return this.zone.quests[this.questIndex].stages[this.stage];
    },
    zoneBackground() {
      return UiConstants.backgroundImage(
        Zones.getBackground(this.zone._id)
      );
    },
    enemyImage() {
      return Zones.getEnemyImage(this.zone._id, this.questIndex)
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
    }
  },
  methods: {
    async engage(max, boss) {
      this.request = this.$game.engageQuest(
        this.zone._id * 1,
        this.questIndex * 1,
        max
      );

      try {
        await this.request;
      } catch(exc) {
        await this._handleQuestError(exc);
      }
    },
    handleInventoryDelta(lootDrops) {
      for (let itemId in lootDrops.changes) {
        // if already was dropped before - just inc loot counter
        if (this.lootHash[itemId]) {
          this.lootHash[itemId].count += lootDrops.delta[itemId];
        } else {
          // or add to loot array and hash for tracking
          let copy = { ...lootDrops.changes[itemId] };
          copy.count = lootDrops.delta[itemId];
          this.$set(this.lootHash, itemId, copy);
          this.rewards.push(this.lootHash[itemId]);
        }
      }
    },
    async _handleQuestError(error) {
      console.log("_handleQuestError", error, Errors.NoEnergy)
      switch (error) {
        case Errors.NoHealth:
          await ShowResourceRefill(Stat.Health);
          break;

        case Errors.NoEnergy:
          await ShowResourceRefill(Stat.Energy);
          break;
      }
    }
  }
};
</script>


<style lang="less" scoped>
.stamina-buttons {
  padding: 0.5rem;
  * > {
    margin: 0.5rem;
  }
}

.quest-mid {
  width: 100%;
  height: 30vh;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin-bottom: 3rem;

  .quest-nav:first-child {
    padding-left: 1rem;
  }

  .quest-nav:last-child {
    padding-right: 1rem;
  }
}

.quest-footer {
  min-height: 10rem;
  width: 100%;
}

.quest-image {
  align-self: flex-end;
  padding-bottom: 1rem;
  height: 80%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

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

.enemy-title-font {
  position: absolute;
  top: 0;
}

.hidden {
  opacity: 0;
}

.quest-nav {
  cursor: pointer;
  height: 14rem;
  transition: all 0.2s ease;
}
</style>


