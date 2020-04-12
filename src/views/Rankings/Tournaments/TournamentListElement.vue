<template>
  <StripedPanel class="flex flex-column panel padding-top-1 padding-bottom-1 margin-1 full-flex">
    <span
      class="title font-size-22 font-weight-900 margin-bottom-1"
      v-html="$t('tournament-title', { tier: tournament.tier, type: tournamentType, tierColor: tierColor(tournament.tier)})"
    />

    <StripedContent
      classes="margin-top-2 margin-bottom-2"
      contentClasses="width-100 flex flex-space-evenly"
      stripeHeight="10rem"
    >
      <div class="flex flex-column">
        <div class="flex flex-center panel-input padding-1">
          <div class="icon-timer icon-size-mini"></div>
          <span class="font-size-18">{{timer.value}}</span>
        </div>

        <div class="flex font-size-22 margin-1">
          <span class="margin-right-half">{{$t("players-joined")}}</span>
          <IconWithValue iconClass="icon-person">{{tournament.totalParticipants}}</IconWithValue>
        </div>
      </div>

      <div class="flex flex-center font-size-22 margin-bottom-1" v-if="currentRank">
        <span class="margin-right-half">{{$t("current-rank")}}</span>
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
  props: ["tournament", "currentRank"],
  components: { CustomButton, StripedPanel, StripedContent, IconWithValue },
  data: () => ({
    timer: new Timer(true)
  }),
  mounted() {
    this.timer.timeLeft =
      this.tournament.duration -
      (this.$game.nowSec - this.tournament.startTime);
  },
  computed: {
    tournamentType() {
      let options = {};
      const rankingOptions = this.tournament.rankingState.typeOptions;
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

      return this.$t(
        `ranking-type-${this.tournament.rankingState.typeOptions.type}`,
        options
      );
    }
  },
  methods: {
    tierColor(tier) {
      if (tier == 1) {
        return "rarity-common";
      }

      if (tier == 2) {
        return "rarity-epic";
      }

      if (tier == 3) {
        return "rarity-legendary";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.tournament-title {
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