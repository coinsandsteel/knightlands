<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="hallowen-bg"></div>
    <Title class="enemy-title-font margin-top-1 font-outline">
      {{ $t("char") }}
    </Title>

    <div class="flex flex-evenly-spaced width-100 padding-2">
      <ProgressBar
        :value="user.exp"
        :maxValue="nextExp"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="grey"
        valueClass="white-font font-outline font-size-20"
        class="margin-bottom-1"
      >
        <template v-slot:label><span class="icon-exp"></span></template>
      </ProgressBar>
      <div class="flex flex-center panel-input">
        <span class="font-size-25 rarity-epic font-outline">
          {{ $t("level-full", { lvl: user.level }) }}
        </span>
      </div>
    </div>

    <div
      class="flex flex-center flex-evenly-spaced width-100 padding-2 font-size-22 font-outline"
    >
      <div
        class="stats-wrapper flex flex-column flex-evenly-spaced flex-item-center stat-block"
      >
        <div
          :key="'title_' + key"
          class="stat-t"
          v-for="(value, key) in primaryStats"
        >
          {{ $t("stat_" + key) }}
        </div>
        <div
          :key="'value_' + key"
          class="stat-v enemy-title-font"
          v-for="(value, key) in primaryStats"
        >
          <span v-if="!attributesNeedReset">{{ value }}</span>
          <NumericValue
            else
            class="width-100"
            :id="'num_value_' + key"
            :showMax="true"
            :value="getStatValue(key)"
            :maxValue="getMaxStatValue(key)"
            :decreaseCondition="canDecrease(key)"
            :increaseCondition="canIncrease"
            @inc="increaseAttribute(key)"
            @dec="decreaseAttribute(key)"
            @reset="reset(key)"
          />
        </div>
      </div>

      <div>
        <Avatar :preview="true" />
      </div>

      <div
        class="stats-wrapper flex flex-column flex-evenly-spaced flex-item-center stat-block"
      >
        <div class="stat-t s1">
          HP:
        </div>
        <div class="stat-t s2">
          &#8593;HP:
        </div>
        <div class="stat-t s3">
          Energy:
        </div>
        <div class="stat-t s4">
          &#8593;Energy:
        </div>
        <div class="v1 stat-v enemy-title-font">
          {{ secondaryStats.maxHealth }}
        </div>
        <div class="v2 stat-v enemy-title-font">
          {{ secondaryStats.hpRegen }}&nbsp;/&nbsp;hr.
        </div>
        <div class="v3 stat-v enemy-title-font">
          {{ secondaryStats.maxEnergy }}
        </div>
        <div class="v4 stat-v enemy-title-font">
          {{ secondaryStats.energyRegen }}&nbsp;/&nbsp;hr.
        </div>
      </div>
    </div>

    <div
      v-show="attributesNeedReset"
      class="flex flex-center flex-full margin-top-3 flex-space-around margin-bottom-3"
    >
      <CustomButton type="green" @click="confirmAttributes" id="apply-btn">{{
        $t("btn-apply")
      }}</CustomButton>
      <CustomButton @click="resetAttributes">{{
        $t("btn-reset")
      }}</CustomButton>
    </div>
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

export default {
  mixins: [AppSection],
  components: {
    Title,
    ProgressBar,
    CustomButton,
    IconWithValue,
    ItemInfo,
    Avatar,
    NumericValue
  },
  created() {
    //this.title = "w-simple-dun";
  },
  activated() {
    this.init();
  },
  deactivated() {
    this.resetAttributes();
  },
  data: () => ({
    edit: true,
    purchasedAttributes: {}
  }),
  computed: {
    ...mapState({
      user: state => state.dungeon.user
    }),
    ...mapGetters({
      stats: "dungeon/playerStats",
      nextExp: "dungeon/nextExp"
    }),
    primaryStatsSum() {
      return _.sum(Object.values(this.primaryStats));
    },
    primaryStats() {
      return this.user.stats;
    },
    secondaryStats() {
      return {
        ...this.stats,
        hpRegen: Math.floor(3600 / this.stats.hpRegen),
        energyRegen: Math.floor(3600 / this.stats.energyRegen)
      };
    },
    attributesNeedReset() {
      for (let i in this.purchasedAttributes) {
        if (this.purchasedAttributes[i] !== 0) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    init() {
      for (let statKey in Object.keys(this.primaryStats)) {
        this.$set(this.purchasedAttributes, statKey, 0);
      }
    },
    getAttributeValue(stat) {
      return this.primaryStats[stat] + (this.purchasedAttributes[stat] || 0);
    },
    getStatValue(stat) {
      return this.getAttributeValue(stat);
    },
    getMaxStatValue() {
      return this.user.level - this.primaryStatsSum - 1;
    },
    canIncrease() {
      return this.primaryStatsSum < this.user.level - 1;
    },
    canDecrease(att) {
      return this.getEditedAttribute(att) > 0 && this.attributesNeedReset;
    },
    increaseAttribute(attr) {
      this.purchasedAttributes[attr]++;
      return true;
    },
    decreaseAttribute(attr) {
      this.purchasedAttributes[attr]--;
      return true;
    },
    async confirmAttributes() {
      console.log("confirmAttributes", _.clone(this.purchasedAttributes));
      //await this.performRequest(this.$game.buyStats(this.purchasedAttributes));
      this.init();
    },
    getEditedAttribute(attr) {
      return this.purchasedAttributes[attr];
    },
    reset(attr) {
      while (this.canDecrease(attr)) {
        this.decreaseAttribute(attr);
      }
    },
    resetAttributes() {
      for (let i in this.purchasedAttributes) {
        this.purchasedAttributes[i] = 0;
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
  display: grid;
  justify-content: center;
  grid-template-rows: repeat(4, 1rem);
  grid-template-columns: repeat(2, 1fr);
  row-gap: 1rem;
}
.stat-t {
  text-align: right;
}
.stat-v {
  display: flex;
  justify-content: left;
  align-items: center;
}
.stat-v .btn-plus {
  margin-left: 0.5em;
}
.slots {
  display: grid;
  grid-row: 1 / 3;
  grid-column: 1 / 3;
}

.stat-block {
  min-width: 35%;
  text-align: left;
}

.flex-evenly-spaced {
  justify-content: space-evenly;
}
.energy-hallowen {
  .icon_nrg_halloween;
  .icon();
}
.slots {
  display: grid;
  grid-template-columns: 4em 8.5em;
  grid-template-rows: 4em 4em;
  gap: 0 0.5em;
  grid-template-areas:
    "mHand Avatar"
    "oHand Avatar";
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
</style>
