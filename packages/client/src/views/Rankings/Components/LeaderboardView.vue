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
        <span class="yellow-title">{{ currentRank.rank.score }}</span>
      </div>
    </div>

    <div class="full-flex width-100 dummy-height" v-if="records.length > 0">
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
          :target="currentRank && currentRank.target"
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

    <portal to="footer" v-if="isActive && showInfoButton">
      <CustomButton type="grey" @click="openInfo">{{
        $t("leaderboard-info")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import LeaderboardListElement from "./LeaderboardListElement.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["id"],
  mixins: [ActivityMixin],
  components: { LeaderboardListElement, CustomButton },
  data: () => ({
    records: [],
    currentPage: 0,
    itemSize: 40,
    fetchInProcess: false,
    currentRank: null,
    fetchedAll: false,
    showInfoButton: false
  }),
  watch: {
    id: {
      immediate: true,
      async handler(newId) {
        if (this._id == newId) {
          return;
        }

        if (this.$refs.scroller) {
          this.$refs.scroller.scrollToPosition(0);
        }

        this._id = newId;
        this.fetchInProcess = false;
        this.currentPage = 0;
        this.fetchedAll = false;

        await this.fetchNextPage(true);
        this.currentRank = await this.getRank(this.id);
      }
    }
  },
  activated() {
    if (this._position) {
      this.$refs.scroller.scrollToPosition(this._position.start);
    }
  },
  methods: {
    openInfo() {},
    async getRank(rankingId) {},
    async fetchRankings(rankingId, page) {},
    isYou(id) {
      if (!this.participates) return false;
      return this.currentRank.rank.id == id;
    },
    async fetchNextPage(replace) {
      if (this.fetchInProcess || this.fetchedAll) {
        return true;
      }

      this.fetchInProcess = true;

      try {
        let newRecords = await this.fetchRankings(this.id, this.currentPage);
        if (newRecords) {
          this.fetchedAll = newRecords.finished;
          if (replace) {
            this.records = newRecords.records;
          } else {
            this.records.push(...newRecords.records);
          }

          this.currentPage++;
        }
      } finally {
        this.fetchInProcess = false;
      }
    },
    scrollUpdated(start, end) {
      if (start != 0 && end == this.records.length) {
        this.fetchNextPage();
      }

      this._position = this.$refs.scroller.getScroll();
    }
  },
  computed: {
    participates() {
      if (this.currentRank && this.currentRank.rank) {
        return true;
      }

      return false;
    },
    rank() {
      if (this.currentRank.rank.rank == 0) {
        return this.$t("race-unranked");
      }

      return this.currentRank.rank.rank;
    }
  }
};
</script>
