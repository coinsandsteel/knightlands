<template>
  <div class="screen-content dummy-height flex-items-center">
    <div class="screen-background"></div>
    <div
      class="title flex flex-center font-size-20 color-panel-2 no-padding"
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

    <div class="width-100" v-bar>
      <div>
        <div class="width-100 dummy-height" v-if="qualified.length > 0">
          <div class="color-panel-1">
            <span class="font-size-22">{{ $t("quali") }}</span>
          </div>
          <LeaderboardListElement
            v-for="(item, index) in qualified"
            :showRank="true"
            :key="item.name"
            :index="index"
            :rank="index + 1"
            :id="item.name"
            :pId="item.id"
            :score="item.score"
            :height="itemSize"
            :you="isYou(item.id)"
            :target="currentRank.target"
          />
        </div>

        <div
          class="full-flex width-100 dummy-height"
          v-if="nonQualified.length > 0 && currentRank"
        >
          <div class="color-panel-1">
            <span class="font-size-22">{{ $t("non-quali") }}</span>
          </div>

          <RecycleScroller
            ref="scroller"
            class="width-100 height-100"
            :items="nonQualified"
            :item-size="itemSize"
            key-field="name"
            v-slot="{ item, index }"
            :emitUpdate="nonQualified.length > 0 && !fetchedAll"
            @update="scrollUpdated"
          >
            <LeaderboardListElement
              :index="index"
              :rank="index + 1"
              :id="item.name"
              :pId="item.id"
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
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton type="grey" @click="openInfo">{{
        $t("leaderboard-info")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import { create } from "vue-modal-dialogs";
import RaceInfo from "./RaceInfo.vue";
import LeaderboardListElement from "../Components/LeaderboardListElement.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import CustomButton from "@/components/Button.vue";

const infoWindow = create(RaceInfo);

export default {
  props: ["id"],
  mixins: [ActivityMixin],
  components: { LeaderboardListElement, CustomButton },
  data: () => ({
    nonQualified: [],
    qualified: [],
    currentPage: 0,
    itemSize: 40,
    fetchInProcess: false,
    currentRank: null,
    fetchedAll: false
  }),
  async activated() {
    this.qualified = [];
    this.nonQualified = [];
    this.fetchedAll = false;
    this.currentPage = 0;
    this.currentRank = await this.getRank(this.id);
    this.fetchNextPage();
  },
  methods: {
    async getRank(rankingId) {
      return await this.$game.getRaceInfo(rankingId);
    },
    async fetchRankings(rankingId, page) {
      return await this.$game.fetchRaceRankings(rankingId, page);
    },
    async openInfo() {
      await infoWindow({
        race: this.currentRank
      });
    },
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
        let newRecords = await this.fetchRankings(this.id, this.currentPage);
        if (newRecords) {
          this.fetchedAll = newRecords.finished;
          this.currentPage++;

          if (this.qualified.length == 0) {
            for (let index = 0; index < newRecords.records.length; index++) {
              const record = newRecords.records[index];
              if (
                this.qualified.length != this.currentRank.maxParticipants &&
                record.score >= this.currentRank.target
              ) {
                this.qualified.push(record);
              } else {
                this.nonQualified.push(record);
              }
            }
          } else {
            this.nonQualified.push(...newRecords.records);
          }
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
      if (this.currentRank && this.currentRank.rank) {
        return this.currentRank.id == this.id;
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
