<template>
  <StripedPanel class="flex flex-column panel padding-top-1 padding-bottom-1 margin-1 full-flex">
    <span
      class="title font-size-22 font-weight-900 margin-bottom-1"
      v-html="$t('race-title', { tier, type: raceType, tierColor})"
    />

    <StripedContent
      classes="margin-top-2 margin-bottom-2"
      contentClasses="width-100 flex flex-space-evenly"
      stripeHeight="10rem"
    >
      <div class="flex flex-column flex-space-between">
        <div class="flex flex-center panel-input padding-1">
          <div class="icon-timer icon-size-mini"></div>
          <span class="font-size-18">{{timer.value}}</span>
        </div>

        <div class="flex font-size-22 margin-1">
          <span class="margin-right-half">{{$t("players-joined")}}</span>
          <IconWithValue iconClass="icon-person">{{race.totalParticipants}}</IconWithValue>
        </div>
      </div>

      <div class="flex flex-space-between flex-center flex-column flex-center font-size-22">
        <IconWithValue iconClass="icon-leaderboards big">x{{targetMultiplier}}</IconWithValue>
        <IconWithValue iconClass="icon-loot big">x{{rewardsMultiplier}}</IconWithValue>
      </div>

      <div class="flex flex-center font-size-22 margin-bottom-1" v-if="currentRank">
        <IconWithValue iconClass="icon-rankings">{{currentRank.rank.rank}}</IconWithValue>
      </div>
        
      
      
    </StripedContent>

    <div class="flex flex-items-end">
      <CustomButton type="grey" @click="$emit('ranks')">{{$t("btn-ranks")}}</CustomButton>
      <CustomButton type="green" @click="$emit('rewards')">{{$t("btn-rewards")}}</CustomButton>
      <CustomButton type="yellow" @click="$emit('join')" v-if="!currentRank">{{$t("btn-join")}}</CustomButton>
    </div>
  </StripedPanel>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import RankingType from "@/../knightlands-shared/ranking_type";
import RaidsMeta from "@/raids_meta";
import Timer from "@/timer";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["race", "currentRank"],
  components: { CustomButton, StripedPanel, StripedContent, IconWithValue },
  data: () => ({
    timer: new Timer(true)
  }),
  mounted() {
    this.timer.timeLeft =
      this.race.config.duration - (this.$game.nowSec - this.race.startTime);
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
        return Math.floor(this.race.rewardsMultiplier * 100)/100;
    },
    targetMultiplier() {
        return Math.floor(this.race.targetMultiplier * 100)/100;
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