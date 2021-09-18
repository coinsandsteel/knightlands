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
        <span class="yellow-title">{{ currentRank.score }}</span>
      </div>
    </div>
    <div class="full-flex width-100 dummy-height" v-bar>
      <div>
        <div v-for="(reward, index) in rewards" :key="index">
          <PrizePoolRewardListElement
            :rank="+index + 1"
            :reward="reward"
            :you="+index + 1 == rank"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PrizePoolRewardListElement from "./PrizePoolRewardListElement.vue";

export default {
  props: ["currentRank"],
  components: { PrizePoolRewardListElement },
  data: () => ({
    rewards: []
  }),
  async mounted() {
    this.rewards = await this.$game.getPrizePoolRewards();
  },
  computed: {
    participates() {
      if (this.currentRank && this.currentRank.rank) {
        return this.currentRank.id == this.id;
      }

      return false;
    },
    rank() {
      if (!this.currentRank) {
        return this.$t("race-unranked");
      }

      if (this.currentRank.rank == 0) {
        return this.$t("race-unranked");
      }

      return this.currentRank.rank;
    }
  }
};
</script>
