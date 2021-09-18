<template>
  <div class="screen-content dummy-height flex-items-center">
    <div class="screen-background"></div>
    <div
      class="title flex flex-center font-size-20 color-panel-2"
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

    <div
      class="full-flex width-100 dummy-height"
      v-if="records.length > 0 && currentRank"
    >
      <RecycleScroller
        ref="scroller"
        class="width-100 height-100"
        :items="records"
        :item-size="itemSize"
        key-field="name"
        v-slot="{ item, index }"
        :emitUpdate="records.length > 0 && !fetchedAll"
        @update="scrollUpdated"
      >
        <LeaderboardListElement
          :index="index"
          :rank="index + 1"
          :id="item.name"
          :pId="item.id"
          :avatar="item.avatar"
          :score="item.score"
          :height="itemSize"
          :you="isYou(item.id)"
          :target="currentRank.target"
        />
      </RecycleScroller>
    </div>

    <div class="flex flex-center full-flex" v-else>
      <div class="panel-input padding-1">
        <span
          class="font-size-20 flex flex-center"
          v-html="$t('empty-leaderboard')"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import LeaderboardListElement from "../Components/LeaderboardListElement.vue";

export default {
  components: { LeaderboardListElement },
  props: ["currentRank"],
  data: () => ({
    records: [],
    currentPage: 0,
    itemSize: 40,
    fetchInProcess: false,
    fetchedAll: false,
    showInfoButton: false
  }),
  async activated() {
    this.records = [];
    this.currentPage = 0;
    this.fetchedAll = false;
    this.fetchNextPage();
  },
  methods: {
    openInfo() {},
    isYou(id) {
      if (!this.participates) return false;
      return this.currentRank.rank.id == id;
    },
    async fetchNextPage() {
      if (this.fetchInProcess || this.fetchedAll) {
        return true;
      }

      this.fetchInProcess = true;

      try {
        let newRecords = await this.$game.fetchPrizePool(this.currentPage);
        if (newRecords) {
          this.fetchedAll = newRecords.finished;
          this.records.push(...newRecords.records);
          this.currentPage++;
        }
      } finally {
        this.fetchInProcess = false;
      }
    },
    scrollUpdated(start, end) {
      if (end == this.records.length) {
        this.fetchNextPage();
      }
    }
  },
  computed: {
    participates() {
      return !!this.currentRank;
    },
    rank() {
      if (this.currentRank.rank == 0) {
        return this.$t("race-unranked");
      }

      return this.currentRank.rank;
    }
  }
};
</script>
