<template>
  <div class="screen-content">
    <div class="march-rating-rewards-wrapper padding-bottom-2">
      <div
        class="march-rating-rewards font-size-20 _padding-bottom-2 padding-top-2 text-align-left"
      >
        <!-- 1st -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank1"></div>
          <div class="margin-left-1">1st place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 100500 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 2nd -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank2"></div>
          <div class="margin-left-1">2nd place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 10050 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 3rd -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank3"></div>
          <div class="margin-left-1">3rd place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 1005 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 4-7 -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank3 icon-rank3-4"></div>
          <div class="margin-left-1">4-7 place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 100 }}
          </IconWithValue>
        </div>
        <br />
        <!-- 8-10 -->
        <div
          class="march-rating-reward flex-inline flex-no-wrap flex-items-center"
        >
          <div class="r icon-rank3 icon-rank3-5"></div>
          <div class="margin-left-1">8-10 place:</div>
          <IconWithValue
            iconClass="icon-dkt"
            valueClass="margin-half"
            class="margin-left-1"
          >
            {{ 10 }}
          </IconWithValue>
        </div>
      </div>
    </div>
    <!-- <Title class="common-title">Top Player???</Title> -->
    <div
      class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
    >
      <div class="flex-full width-100 dummy-height" v-if="records.length > 0">
        <RecycleScroller
          ref="scroller"
          class="width-100 height-100"
          :items="records"
          :item-size="itemSize"
          key-field="id"
          v-slot="{ item, index }"
          :emitUpdate="records.length > 0 && !fetchedAll"
          @update="scrollUpdated"
        >
          <!-- <div v-if="item.isTitle">Pet {{ item.petClass }}</div> -->
          <Title v-if="item.isTitle" class="common-title"
            >Top Players??? - Pet {{ item.petClass }}</Title
          >
          <MarchRankingElement
            v-else
            :index="index"
            :rank="item.rank"
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
  </div>
</template>

<script>
import MarchRankingElement from "@/views/March/Rankings/MarchRankingElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import meta from "@/metadata/halloween/dungeon_meta";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { MarchRankingElement, IconWithValue },
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
    // await this.fetchNextPage();
    await this.fetchRankings();
  },
  methods: {
    isYou(id) {
      if (!this.participates) return false;
      return this.currentRank.id == id;
    },
    async fetchCurrentRank() {
      this.currentRank = await this.performRequest(
        this.$store.dispatch("march/rankings", { personal: true })
      );
    },
    async fetchRankings() {
      const result = await Promise.all(
        [1, 2, 3, 4, 5].map(petClass => {
          return this.performRequest(
            // @todo: check and uncomment
            // this.$store.dispatch("march/rankings", { petClass })

            // @todo: remove and uncomment above
            this.$store.dispatch("march/rankings", { page: this.currentPage })
          );
        })
      );
      let newRecords = [];
      for (let i = 0; i < result.length; i++) {
        let records = result[i] && result[i].records ? result[i].records : [];

        // @todo: start remove
        records = [
          ...records,
          ...records,
          ...records,
          ...records,
          ...records,
          ...records,
          ...records,
          ...records,
          ...records,
          ...records
        ];
        // @todo: end remove

        records = records.map((record, index) => {
          const r = { ...record };

          // @todo: start remove
          r.id = r.id + "-" + i + "-" + index;
          // @todo: end remove

          r.rank = index + 1;
          r.isTitle = false;
          return r;
        });
        const titleRecord = {
          id: "title-" + i,
          isTitle: true,
          petClass: i + 1
        };
        newRecords = [...newRecords, titleRecord, ...records];
      }
      this.records = newRecords;
    },
    // async fetchNextPage() {
    //   if (this.fetchInProcess || this.fetchedAll) {
    //     return true;
    //   }

    //   this.fetchInProcess = true;

    //   try {
    //     let newRecords = await this.performRequest(
    //       this.$store.dispatch("march/rankings", { page: this.currentPage })
    //     );
    //     console.log(
    //       "🚀 ~ file: MarchRankings.vue ~ line 77 ~ fetchNextPage ~ newRecords",
    //       newRecords
    //     );
    //     if (newRecords) {
    //       this.fetchedAll = newRecords.finished;
    //       this.records.push(...newRecords.records);
    //       this.currentPage++;
    //     }
    //   } finally {
    //     this.fetchInProcess = false;
    //   }
    // },
    scrollUpdated(start, end) {
      // if (end == this.records.length) {
      //   this.fetchNextPage();
      // }
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

<style scoped lang="less">
.march-rating-rewards-wrapper {
  background: #2f7285;
}
.march-rating-rewards {
  width: 140px;
  margin-left: auto;
  margin-right: auto;
}
.common-title {
  margin-top: 4px;
}
.icon-rank3-4 {
  filter: hue-rotate(240deg);
}
.icon-rank3-5 {
  filter: hue-rotate(90deg);
}
</style>
