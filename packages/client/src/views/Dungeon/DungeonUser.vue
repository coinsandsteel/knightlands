<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="hallowen-bg"></div>

    <Title class="margin-top-1 font-outline">
      {{ $t("char") }}
    </Title>

    <div class="flex flex-center flex-column width-100 margin-top-2">
      <Avatar :preview="true" />
      <CustomButton
        type="green"
        class="margin-top-1"
        v-if="isFree"
        @click="goToEntrance"
        >{{ $t("d-upg") }}</CustomButton
      >
    </div>

    <div class="flex flex-evenly-spaced width-100 padding-1">
      <div class="flex flex-center panel-input  margin-bottom-2">
        <span
          class="font-size-25 font-outline"
          :class="[upgradeAllowed ? 'rarity-epic' : null]"
        >
          {{ $t("level-full", { lvl: user.level }) }}
        </span>
      </div>

      <ProgressBar
        :value="user.exp"
        :maxValue="nextExp"
        height="3em"
        width="85%"
        valuePosition="bottom"
        barType="grey"
        labelClass="label-panel"
        valueClass="white-font font-outline-heavy font-size-20"
        class="margin-bottom-1"
      >
        <template v-slot:label><span class="icon-exp"></span></template>
      </ProgressBar>
    </div>

    <div
      class="flex flex-center flex-evenly-spaced width-100 color-panel-1 font-size-25 font-outline"
    >
      <div
        class="primary-stats-wrapper stats-wrapper flex flex-center"
        :class="[upgradeAllowed ? 'upgradable' : null]"
      >
        <div
          :key="'title_' + key"
          :class="['title_' + key, 'stat-t']"
          v-for="(value, key) in primaryStats"
        >
          {{ $t(key) }}:
        </div>
        <div
          :key="'value_' + key"
          class="stat-v enemy-title-font"
          :class="['value_' + key]"
          v-for="(value, key) in primaryStats"
        >
          <NumericValue
            v-if="upgradeAllowed"
            class="width-100"
            :id="'num_value_' + key"
            :showMax="true"
            :noExtra="true"
            :rowStyle="{ 'align-items': 'center' }"
            :btnStyle="{ width: '1em', height: '1em' }"
            :value="getStatValue(key)"
            :maxValue="getMaxStatValue(key)"
            :decreaseCondition="canDecrease(key)"
            :increaseCondition="canIncrease"
            @inc="increaseAttribute(key)"
            @dec="decreaseAttribute(key)"
            @reset="reset(key)"
          />
          <span v-else>{{ value }}</span>
        </div>
      </div>

      <div class="stats-wrapper flex flex-center">
        <div class="flex flex-column title-column">
          <div class="stat-t">{{ $t("health") }}</div>
          <div class="stat-t">{{ $t("health-reg") }}</div>
          <div class="stat-t">{{ $t("energy") }}</div>
          <div class="stat-t">{{ $t("energy-reg") }}</div>
        </div>
        <div class="flex flex-column value-column">
          <div
            class="stat-v enemy-title-font"
            :class="[
              secondaryStatsWereModifiedMap['maxHealth'] ? 'rarity-epic' : null
            ]"
          >
            {{ secondaryStats.maxHealth }}
          </div>
          <div
            class="stat-v enemy-title-font"
            :class="[
              secondaryStatsWereModifiedMap['hpRegen'] ? 'rarity-epic' : null
            ]"
          >
            {{ secondaryStats.hpRegen }}&nbsp;/&nbsp;hr
          </div>
          <div
            class="stat-v enemy-title-font"
            :class="[
              secondaryStatsWereModifiedMap['maxEnergy'] ? 'rarity-epic' : null
            ]"
          >
            {{ secondaryStats.maxEnergy }}
          </div>
          <div
            class="stat-v enemy-title-font"
            :class="[
              secondaryStatsWereModifiedMap['energyRegen']
                ? 'rarity-epic'
                : null
            ]"
          >
            {{ secondaryStats.energyRegen }}&nbsp;/&nbsp;hr
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="attributesModified"
      class="stat-commit flex flex-center width-100 margin-top-2 flex-evenly-spaced margin-bottom-3"
    >
      <CustomButton @click="resetAttributes">{{
        $t("btn-reset")
      }}</CustomButton>
      <CustomButton type="green" @click="confirmAttributes" id="apply-btn">{{
        $t("btn-apply")
      }}</CustomButton>
    </div>

    <DungeonEquipment />
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapGetters } from "vuex";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import ItemInfo from "@/components/ItemInfo.vue";
import Avatar from "@/views/Character/Avatars/Avatar.vue";
import NumericValue from "@/components/NumericValue.vue";
import DungeonEquipment from "@/views/Dungeon/Inventory/Equipment.vue";

export default {
  mixins: [AppSection],
  components: {
    Title,
    ProgressBar,
    CustomButton,
    IconWithValue,
    ItemInfo,
    Avatar,
    NumericValue,
    DungeonEquipment
  },
  activated() {
    this.init();
  },
  deactivated() {
    this.resetAttributes();
  },
  data: () => ({
    edit: true,
    statsDelta: {}
  }),
  watch: {
    "user.stats": {
      deep: true,
      handler() {
        this.init();
      }
    }
  },
  computed: {
    ...mapState({
      user: state => state.dungeon.user,
      isFree: state => state.dungeon.maze.isFree
    }),
    ...mapGetters({
      playerStats: "dungeon/playerStats",
      nextExp: "dungeon/nextExp"
    }),
    statsDeltaSum() {
      return _.sum(Object.values(this.statsDelta));
    },
    primaryStatsSum() {
      return _.sum(Object.values(this.primaryStats));
    },
    primaryStats() {
      return this.user.stats;
    },
    primaryStatsModified() {
      const statsModified = {};
      _.keys(this.user.stats).forEach(key => {
        statsModified[key] = this.getStatValue(key);
      });
      return statsModified;
    },
    secondaryStats() {
      const currentPlayerStats = this.playerStats(this.primaryStatsModified);
      return {
        ...currentPlayerStats,
        hpRegen: Math.floor(3600 / currentPlayerStats.hpRegen),
        energyRegen: Math.floor(3600 / currentPlayerStats.energyRegen)
      };
    },
    secondaryStatsWereModifiedMap() {
      const initialPlayerstats = this.playerStats(this.primaryStats);
      const currentPlayerStats = this.playerStats(this.primaryStatsModified);
      const statsModified = {};
      _.keys(initialPlayerstats).forEach(key => {
        statsModified[key] =
          initialPlayerstats[key] !== currentPlayerStats[key];
      });
      return statsModified;
    },
    attributesModified() {
      for (let i in this.statsDelta) {
        if (this.statsDelta[i] !== 0) {
          return true;
        }
      }
      return false;
    },
    canIncrease() {
      return this.statsDeltaSum < this.user.level - 1;
    },
    upgradeAllowed() {
      return this.primaryStatsSum < this.user.level - 1;
    }
  },
  methods: {
    goToEntrance() {
      this.$router.push({ name: "dungeon-entrance" });
    },
    init() {
      for (let statKey in this.primaryStats) {
        this.$set(this.statsDelta, statKey, 0);
      }
    },
    commit() {
      for (let statKey in this.primaryStatsModified) {
        this.$set(this.statsDelta, statKey, 0);
      }
    },
    getAttributeValue(stat) {
      return this.primaryStats[stat] + (this.statsDelta[stat] || 0);
    },
    getStatValue(stat) {
      return this.getAttributeValue(stat);
    },
    getMaxStatValue() {
      return this.user.level - this.statsDeltaSum - 1;
    },
    canDecrease(att) {
      return this.getEditedAttribute(att) > 0 && this.attributesModified;
    },
    increaseAttribute(attr) {
      this.statsDelta[attr]++;
      return true;
    },
    decreaseAttribute(attr) {
      this.statsDelta[attr]--;
      return true;
    },
    async confirmAttributes() {
      await this.$store.dispatch(
        "dungeon/commitStats",
        this.primaryStatsModified
      );
    },
    getEditedAttribute(attr) {
      return this.statsDelta[attr];
    },
    reset(attr) {
      while (this.canDecrease(attr)) {
        this.decreaseAttribute(attr);
      }
    },
    resetAttributes() {
      for (let i in this.statsDelta) {
        this.statsDelta[i] = 0;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.hallowen-bg {
  background-color: #40374d;
  z-index: -1;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.stats-wrapper {
  width: 50%;
}
.primary-stats-wrapper {
  display: grid;
  grid-template-columns: 60% 36%;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  grid-auto-columns: 1fr;
  gap: 0.1rem 4%;
  grid-auto-flow: row;
  grid-template-areas:
    "title_str value_str"
    "title_dex value_dex"
    "title_int value_int"
    "title_sta value_sta";
}
.primary-stats-wrapper.upgradable {
  grid-template-columns: 50% 50%;
  gap: 0.1rem 0;
}

.title_str {
  grid-area: title_str;
}
.title_dex {
  grid-area: title_dex;
}
.title_int {
  grid-area: title_int;
}
.title_sta {
  grid-area: title_sta;
}

.value_str {
  grid-area: value_str;
}
.value_dex {
  grid-area: value_dex;
}
.value_int {
  grid-area: value_int;
}
.value_sta {
  grid-area: value_sta;
}

.stat-t {
  text-align: right;
  margin-bottom: 0.5rem;
}
.stat-v {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  margin-right: 5%;
  margin-bottom: 0.5rem;
}
.title-column {
  width: 60%;
  display: flex;
  justify-content: right;
  margin-right: 4%;
}
.value-column {
  width: 36%;
  display: flex;
  justify-content: left;
}
.slots {
  display: grid;
  grid-row: 1 / 3;
  grid-column: 1 / 3;
}

.flex-evenly-spaced {
  justify-content: space-evenly;
}
.energy-hallowen {
  .icon_nrg_halloween;
  .icon();
}
.avatar {
  grid-area: Avatar;
  background: green;
}
.avatar img {
  min-width: 100%;
}
.m-hand {
  grid-area: mHand;
}
.o-hand {
  grid-area: oHand;
}
.hand {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-plus {
  background-image: url("/images/ui/button_plus_status_bar.png");
  background-size: contain;
  width: 3rem;
  height: 3rem;
  display: inline-block;
  background-color: #70ee70;
}
.panel-input {
  padding: 0 1em;
}
.stat-commit .btn {
  min-width: 25%;
}
</style>
