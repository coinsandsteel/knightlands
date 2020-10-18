<template>
  <div class="screen-content dummy-height">
    <div
      class="title flex flex-center font-size-20 margin-bottom-1 margin-top-1"
      v-if="participates"
    >
      <div class="flex margin-right-2">
        <span class="margin-right-half">{{ $t("your-rank") }}</span>
        <span class="green-title">{{ rank }}</span>
      </div>

      <div class="flex">
        <span class="margin-right-half">{{ $t("your-score") }}</span>
        <span class="yellow-title">{{ currentRank.rank.score }}</span>
      </div>
    </div>
    <div class="full-flex width-100 dummy-height" v-bar>
      <div>
        <div v-for="(reward, index) in rewardsByTier" :key="index">
          <RankedRewardsListElement
            :index="index"
            :minRank="reward.minRank"
            :maxRank="reward.maxRank"
            :rewards="reward.loot"
            :dkt="reward.dkt"
            :you="isYou(reward.minRank, reward.maxRank)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RankedRewardsListElement from "./RankedRewardsListElement.vue";

export default {
  props: ["id"],
  components: { RankedRewardsListElement },
  data: () => ({
    currentRank: null,
    rewards: null
  }),
  computed: {
    participates() {
      if (this.currentRank && this.currentRank.rank) {
        return this.currentRank.id == this.id;
      }

      return false;
    },
    rewardsByTier() {
      if (!this.rewards) return [];
      return this.rewards;
    },
    rank() {
      if (this.currentRank.rank.rank == 0) {
        return this.$t("race-unranked");
      }

      return this.currentRank.rank.rank;
    }
  },
  methods: {
    isYou(minRank, maxRank) {
      if (!this.participates) return false;
      const rank = this.currentRank.rank.rank;
      return rank >= minRank && rank <= maxRank;
    }
  }
};
</script>
