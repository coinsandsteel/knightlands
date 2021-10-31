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

      <div class="flex ">
        <span class="margin-right-half">{{ $t("your-score") }}</span>
        <span class="yellow-title">{{ currentRank.score }}</span>
      </div>

      <div class="flex margin-left-2" v-if="reward">
        <span class="margin-right-half">{{ $t("your-reward") }}</span>
        <IconWithValue valueClass="yellow-title" iconClass="icon-usdc">{{
          reward
        }}</IconWithValue>
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
        <RankingsListElement
          :index="index"
          :rank="index + 1"
          :id="item.name"
          :pId="item.id"
          :avatar="item.avatar"
          :score="item.score"
          :height="itemSize"
          :you="isYou(item.id)"
        />
      </RecycleScroller>
    </div>
  </div>
</template>

<script>
import RankingsListElement from "./RankingsListElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import meta from "@/metadata/halloween/dungeon_meta";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { RankingsListElement, IconWithValue },
  data: () => ({
    currentRank: null,
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
    await this.fetchCurrentRank();
    await this.fetchNextPage();
  },
  methods: {
    isYou(id) {
      if (!this.participates) return false;
      return this.currentRank.id == id;
    },
    async fetchCurrentRank() {
      this.currentRank = await this.performRequest(
        this.$store.dispatch("dungeon/fetchRank")
      );
    },
    async fetchNextPage() {
      if (this.fetchInProcess || this.fetchedAll) {
        return true;
      }

      this.fetchInProcess = true;

      try {
        let newRecords = await this.performRequest(
          this.$store.dispatch("dungeon/fetchRankings", this.currentPage)
        );
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
    reward() {
      if (this.rank > meta.rewards.length) {
        return 0;
      }

      return meta.rewards[this.rank - 1];
    },
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
