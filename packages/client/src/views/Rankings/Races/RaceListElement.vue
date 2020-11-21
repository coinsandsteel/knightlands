<template>
  <div class="flex flex-column full-flex padding-bottom-1">
    <Title :stackBottom="true" :stackTop="true">
      <span v-html="$t('race-title', { tier, type: raceType, tierColor })" />
    </Title>

    <div class="color-panel-5 margin-top-1">
      <div class="width-100 flex flex-space-evenly">
        <div class="flex flex-column flex-space-between">
          <div class="flex flex-center panel-input padding-1">
            <div class="icon-timer small"></div>
            <span class="font-size-18">{{ timer.value }}</span>
          </div>

          <div class="flex font-size-22 margin-1">
            <span class="margin-right-half">{{ $t("players-joined") }}</span>
            <IconWithValue iconClass="icon-person">{{
              race.totalParticipants
            }}</IconWithValue>
          </div>
        </div>

        <div
          class="flex flex-space-between flex-center flex-column flex-center font-size-22"
        >
          <IconWithValue iconClass="icon-leaderboards big"
            >x{{ targetMultiplier }}</IconWithValue
          >
          <IconWithValue iconClass="icon-loot big"
            >x{{ rewardsMultiplier }}</IconWithValue
          >
        </div>

        <div
          class="flex flex-center font-size-22 margin-bottom-1"
          v-if="currentRank"
        >
          <IconWithValue iconClass="icon-rankings big">{{
            currentRank.rank.rank
          }}</IconWithValue>
        </div>
      </div>

      <div class="flex flex-center margin-top-1">
        <CustomButton type="grey" @click="$emit('ranks')">{{
          $t("btn-ranks")
        }}</CustomButton>

        <CustomButton type="green" @click="$emit('rewards')">{{
          $t("btn-rewards")
        }}</CustomButton>

        <CustomButton type="grey" @click="openInfo">{{
          $t("leaderboard-info")
        }}</CustomButton>

        <CustomButton
          type="yellow"
          @click="$emit('join')"
          v-if="!currentRank"
          :disabled="cooldown > 0"
          >{{ $t("btn-join") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import RankingType from "@/../../knightlands-shared/ranking_type";
import RaidsMeta from "@/raids_meta";
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue";

import { create } from "vue-modal-dialogs";
import RaceInfo from "./RaceInfo.vue";

const infoWindow = create(RaceInfo);

export default {
  props: ["race", "currentRank", "cooldown"],
  components: { CustomButton, IconWithValue, Title },
  data: () => ({
    timer: new Timer(true),
    winnerCooldownTimer: new Timer(true)
  }),
  mounted() {
    this.timer.timeLeft =
      this.race.config.duration - (this.$game.nowSec - this.race.startTime);
    this.listener = () => {
      this.$emit("finished");
    };
    this.timer.on("finished", this.listener);
  },
  beforeDestroy() {
    this.timer.off("finished", this.listener);
  },
  computed: {
    tier() {
      return this.race.config.tier;
    },
    tierColor() {
      let tier = this.tier;
      if (tier == 1) {
        return "rarity-common";
      }

      if (tier == 2) {
        return "rarity-rare";
      }

      if (tier == 3) {
        return "rarity-epic";
      }

      return "rarity-legendary";
    },
    rewardsMultiplier() {
      return Math.floor(this.race.rewardsMultiplier * 100) / 100;
    },
    targetMultiplier() {
      return Math.floor(this.race.targetMultiplier * 100) / 100;
    },
    raceType() {
      let options = {};
      const rankingOptions = this.race.config.type;

      if (
        rankingOptions.type == RankingType.CraftedItemsByRarity ||
        rankingOptions.type == RankingType.DisenchantedItemsByRarity ||
        rankingOptions.type == RankingType.CollectedItemsByRarity ||
        rankingOptions.type == RankingType.LevelItemsByRarity
      ) {
        options.rarityClass = rankingOptions.rarity;
        options.rarity = this.$t(rankingOptions.rarity);
      }

      if (rankingOptions.type == RankingType.DamageInParticularRaid) {
        options.raid = this.$t(RaidsMeta[rankingOptions.raid].name);
      }

      return this.$t(`ranking-type-${rankingOptions.type}`, options);
    },
    info() {
      return {
        tier: this.race.config.tier,
        type: this.race.config.type,
        target: Math.floor(
          this.race.config.baseTarget * this.race.targetMultiplier
        ),
        predictedMultipliers: this.race.predictedMultipliers,
        rewardsMultiplier: this.race.rewardsMultiplier,
        targetMultiplier: this.race.targetMultiplier
      };
    }
  },
  methods: {
    openInfo() {
      infoWindow({
        race: this.info
      });
    }
  }
};
</script>

<style lang="less" scoped>
.race-title {
  font-size: 4rem;
  line-height: 4rem;
  background: linear-gradient(
    90deg,
    rgba(38, 16, 52, 0) 0%,
    rgba(38, 16, 52, 0.5550595238095238) 42%,
    rgba(38, 16, 52, 0.5858718487394958) 100%
  );

  min-width: 100%;
}
</style>
