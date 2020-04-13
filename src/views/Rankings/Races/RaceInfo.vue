<template>
  <user-dialog :title="' '" @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-center font-size-20">
        <span
          class="title font-size-22 font-weight-900 margin-bottom-1"
          v-html="$t('race-title', { tier, type: raceType, tierColor})"
        />
        <div class="flex margin-bottom-1 panel-input padding-1">
          <span class="margin-right-half">{{$t("race-target")}}</span>
          <span class="green-yellow font-weight-900">{{target}}</span>
        </div>
        <div class="flex margin-bottom-1">
          <span class="margin-right-half">{{$t("race-target-m")}}</span>
          <span>x{{targetMulti}}</span>
        </div>
        <div class="flex margin-bottom-1">
          <span class="margin-right-half">{{$t("race-rewards-m")}}</span>
          <span>x{{rewardsMulti}}</span>
        </div>

        <span class="title margin-top-2 margin-bottom-1">{{$t("race-predictions")}}</span>

        <div class="flex margin-bottom-1">
          <span class="margin-right-half">{{$t("race-target-m")}}</span>
          <span>x{{nextTargetMulti}}</span>
        </div>
        <div class="flex margin-bottom-1">
          <span class="margin-right-half">{{$t("race-rewards-m")}}</span>
          <span>x{{nextRewardsMulti}}</span>
        </div>

        <span class="orange-title">{{$t("race-mult-hint")}}</span>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import RankingType from "@/../knightlands-shared/ranking_type";
import RaidsMeta from "@/raids_meta";

export default {
  components: { UserDialog },
  props: ["race"],
  computed: {
    target() {
      return this.race.target;
    },
    targetMulti() {
      return Math.floor(this.race.targetMultiplier * 100) / 100;
    },
    rewardsMulti() {
      return Math.floor(this.race.rewardsMultiplier * 100) / 100;
    },
    nextTargetMulti() {
      return (
        Math.floor(this.race.predictedMultipliers.targetMultiplier * 100) / 100
      );
    },
    nextRewardsMulti() {
      return (
        Math.floor(this.race.predictedMultipliers.rewardsMultiplier * 100) / 100
      );
    },
    raceType() {
      let options = {};
      const rankingOptions = this.race.type;

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
    tier() {
      return this.race.tier;
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
    }
  }
};
</script>