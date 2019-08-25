<template>
  <div class="flex flex-column flex-center">
    <div class="font-size-30 enemy-title-font font-outline font-weight-700">{{view.name}}</div>
    <div :style="zoneBackground" class="pixelated flex quest-mid flex-center flex-no-wrap">
      <div
        v-show="questIndex > 0"
        class="quest-nav flex flex-item-center"
        @click="$emit('prevQuest')"
      >
        <div class="nav-arrow left"></div>
      </div>
      <div class="quest-image" :style="enemyImage"></div>
      <div
        v-show="questIndex < maxQuestIndex"
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
        <div class="flex-basis-50 font-size-30 flex flex-column flex-center flex-justify-start">
          <div>Rewards</div>
          <div class="margin-top-small">
            <icon-with-value iconClass="icon-exp" :value="quest.exp"></icon-with-value>
            <icon-with-value iconClass="icon-gold" :value="`${quest.goldMin}-${quest.goldMax}`"></icon-with-value>
          </div>
        </div>
        <div
          class="flex-basis-50 font-size-30 flex flex-column flex-center flex-justify-start"
          v-show="quest.energy"
        >
          <div>Cost</div>
          <div class="margin-top-small">
            <icon-with-value iconClass="icon-energy" :value="quest.energy"></icon-with-value>
          </div>
        </div>
      </div>
      <loot-container class="full-flex loot center" :items="rewards" @hint="showHint"></loot-container>
    </div>
    <div class="quest-footer flex flex-center">
      <div v-if="!isBossUnlocked" class="font-size-30 grey-title font-outline">Kill previous enemies</div>
      <div v-else-if="progress.current >= progress.max">
        <div class="font-size-30 font-outline green-title">Complete</div>
      </div>
      <div v-else class="flex flex-center width-100 flex-space-evenly">
        <custom-button @click="engage(false)">Attack x1</custom-button>
        <custom-button @click="engage(true)">Attack MAX</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
import LootHint from "@/components/LootHint.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import ZoneViews from "@/zone_views.js";

const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

import ProgressBar from "@/components/ProgressBar.vue";
import LootContainer from "@/components/LootContainer.vue";
const ItemType = require("@/../knightlands-shared/item_type");
import Stat from "@/../knightlands-shared/character_stat.js";
import IconWithValue from "@/components/IconWithValue.vue";
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";
import Inventory from "@/inventory";

export default {
  props: ["zone", "questIndex", "maxQuestIndex", "stage"],
  components: { LootContainer, ProgressBar, IconWithValue, CustomButton },
  data() {
    return {
      rewards: [],
      thresholds: UiConstants.progressThresholds,
      lockUI: false,
      lootHash: {}
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
    view() {
      if (!ZoneViews[this.zone._id]) return {};
      return ZoneViews[this.zone._id].quests[this.questIndex] || {};
    },
    quest() {
      return this.zone.quests[this.questIndex].stages[this.stage];
    },
    zoneBackground() {
      return UiConstants.backgroundImage(
        UiConstants.zoneImageByZoneId(this.zone._id)
      );
    },
    enemyImage() {
      return `background-image: url("/images/enemies/${this.view.img}.png");`;
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
    showHint(item) {
      Hint(item);
    },
    async engage(max, boss) {
      this.lockUI = true;
      let lootDrops = await this.$game.engageQuest(
        this.zone._id * 1,
        this.questIndex * 1,
        max
      );

      this.lockUI = false;
    },
    handleInventoryDelta(lootDrops) {
      console.log(lootDrops);
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
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
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

.quest-nav {
  cursor: pointer;
  height: 14rem;
}
</style>


