<template>
  <div class="screen-content" v-bar>
    <div>
      <div class="april-rating-rewards-wrapper padding-bottom-2">
        <div
          class="flex flex-center font-size-20 padding-top-2 text-align-left"
        >
          <div
            class="april-rating-reward flex-items-center width-100 margin-bottom-3"
            v-for="(rewardEntry, rewardEntryIndex) in allRewards"
            :key="'event-reward-rank-' + rewardEntryIndex"
          >
            <div class="flex flex-center margin-bottom-1">
              <div :class="['r', rewardEntry.rankIcon]"></div>
              <div class="margin-left-1">
                {{ rewardEntry.position }} place{{
                  rewardEntryIndex === 4 ? "s" : ""
                }}:
              </div>
            </div>
            <div class="flex flex-center">
              <Loot
                v-for="(lootEntry, lootEntryIndex) in rewardEntry.items"
                :key="`loot-entry-${rewardEntryIndex}-${lootEntryIndex}`"
                class="margin-right-half"
                :item="lootEntry.item"
                :quantity="lootEntry.quantity"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-center margin-bottom-2 font-size-20 ">
          The event will be finished in:<br />
          {{ eventTimer.value }}
        </div>
        <div class="flex flex-center margin-bottom-2 font-size-20 ">
          Rating Reset'n'Reward will be in:<br />
          {{ dailyTimer.value }}
        </div>
        <div class="flex flex-center margin-bottom-3">
          <CustomButton
            type="green"
            :disabled="!hasRewards"
            @click="claimRewards"
            width="20rem"
            >Claim reward</CustomButton
          >
        </div>
      </div>

      <div class="width-100 flex flex-column flex-no-wrap">
        <div class="flex-full width-100" v-if="records.length > 0">
          <RecycleScroller
            ref="scroller"
            class="width-100 height-100"
            :items="records"
            :item-size="itemSize"
            key-field="key"
            v-slot="{ item, index }"
            :emitUpdate="records.length > 0 && !fetchedAll"
            @update="scrollUpdated"
          >
            <Title v-if="item.isTitle" class="common-title"
              >{{ $t("top-players") }} - {{ $t(item.heroClass) }}</Title
            >
            <AprilRankingElement
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
  </div>
</template>

<script>
import _ from "lodash";
import AprilRankingElement from "@/views/April/AprilRankingElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import * as april from "@/../../knightlands-shared/april";
import meta from "@/april_meta.json";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import Timer from "@/timer.js";
import { create } from "vue-modal-dialogs";
import ItemsReceived from "@/components/ItemsReceived.vue";
const ShowItems = create(ItemsReceived, "items");

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { AprilRankingElement, CustomButton, Loot },
  data: () => ({
    records: [],
    currentPage: 0,
    itemSize: 40,
    fetchInProcess: false,
    fetchedAll: false,
    showInfoButton: false,
    places: ["1-st", "2-nd", "3-rd", "4-th", "5 - 10"],
    hasRewards: false,
    eventTimer: new Timer(true, true),
    dailyTimer: new Timer(true, true)
  }),
  async activated() {
    this.records = [];
    this.currentPage = 0;
    this.fetchedAll = false;
    await this.fetchRankings();
  },
  methods: {
    isYou(id) {
      if (!this.participates) return false;
      return this.currentRank.id == id;
    },
    async fetchRankings() {
      const result = await this.performRequest(
        this.$store.dispatch("april/rankings")
      );

      this.hasRewards = result.hasRewards;
      this.eventTimer.timeLeft = result.timeLeft;
      this.dailyTimer.timeLeft = result.resetTimeLeft;

      const records = [];
      for (let i = 0; i < result.rankings.length; i++) {
        let newRecords = [];

        for (let j = 0; j < result.rankings[i].length; j++) {
          newRecords.push(result.rankings[i][j]);
        }

        newRecords = newRecords
          .map((record, index) => {
            if (record.score !== "0") {
              const r = { ...record };
              r.key = r.id + "-" + i + "-" + index;
              r.rank = index + 1;
              r.isTitle = false;
              return r;
            }
          })
          .filter(record => record);
        const titleRecord = {
          id: "title-" + i,
          key: "title-" + i,
          isTitle: true,
          // @todo
          heroClass: [
            april.HERO_CLASS_KNIGHT,
            april.HERO_CLASS_PALADIN,
            april.HERO_CLASS_ROGUE
          ][i % 3]
        };
        records.push(titleRecord);
        if (!_.isEmpty(newRecords)) {
          records.push(...newRecords);
        }
      }
      this.records = records;
    },
    scrollUpdated(start, end) {},
    async claimRewards() {
      let items = await this.performRequestNoCatch(
        this.$store.dispatch("april/claimReward", {
          type: april.REWARD_TYPE_RANKING
        })
      );
      if (items.length) {
        await ShowItems(items);
        this.hasRewards = false;
      }
    }
  },
  computed: {
    allRewards() {
      let rewards = meta.rankingRewards.map((rankEntry, rankIndex) => {
        if (rankIndex === 0) {
          rankEntry.rankIcon = "icon-rank-1";
        } else if (rankIndex >= 1 && rankIndex <= 3) {
          rankEntry.rankIcon = "icon-rank-2";
        } else {
          rankEntry.rankIcon = "icon-rank-3";
        }
        rankEntry.position = this.places[rankIndex];
        return rankEntry;
      });
      return rewards;
    }
  }
};
</script>

<style scoped lang="less">
.april-rating-rewards-wrapper {
  background: #2f7285;
}
.april-rating-rewards {
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
