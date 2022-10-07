<template>
  <div class="screen-content" v-bar>
    <div>
      <div class="battle-rating-rewards-wrapper padding-bottom-2">
        <div
          class="flex flex-center font-size-20 padding-top-2 text-align-left"
        >
          <div
            class="battle-rating-reward flex-items-center width-100 margin-bottom-3"
            v-for="(rewardEntry, rewardEntryIndex) in allRewards"
            :key="'event-reward-rank-' + rewardEntryIndex"
          >
            <div class="flex flex-center margin-bottom-1">
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
            <Title
              v-if="item.isTitle"
              class="common-title"
              :class="{ 'common-title--first': item.isFirstTitle }"
            >
              {{ item.name }}
            </Title>
            <BattleRankingElement
              v-else
              :index="index"
              :rank="item.rank"
              :id="item.id"
              :name="item.name"
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
// import _ from "lodash";
import BattleRankingElement from "@/views/Battle/BattleRankingElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import * as battle from "@/../../knightlands-shared/battle";
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import Timer from "@/timer.js";
import { create } from "vue-modal-dialogs";
import ItemsReceived from "@/components/ItemsReceived.vue";
const ShowItems = create(ItemsReceived, "items");

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { BattleRankingElement, CustomButton, Loot },
  data: () => ({
    records: [],
    currentPage: 0,
    itemSize: 40,
    fetchInProcess: false,
    fetchedAll: false,
    showInfoButton: false,
    places: ["1-st", "2-nd", "3-rd", "4-th", "5 - 10"],
    hasRewards: false,
    eventTimer: new Timer(true, true)
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
      const records = [];
      const result = await this.performRequest(
        this.$store.dispatch("battle/rankings", { mode: "pvp" })
      );
      let isFirstTitle = true;
      const result2 = await this.performRequest(
        this.$store.dispatch("battle/rankings", { mode: "power" })
      );

      if (result) {
        this.hasRewards = result.hasRewards;
        this.eventTimer.timeLeft = result.timeLeft;
        if (result.rankings) {
          const titleRecord = {
            id: "title-" + 1,
            key: "key-" + records.length,
            name: "PVP Score",
            isTitle: true,
            isFirstTitle
          };
          isFirstTitle = false;
          records.push(titleRecord);
          for (let i = 0; i < result.rankings.length; i++) {
            records.push({
              ...result.rankings[i],
              rank: i + 1,
              key: "key-" + records.length
            });
          }
        }
      }
      if (result2) {
        this.hasRewards = result.hasRewards;
        this.eventTimer.timeLeft = result.timeLeft;
        if (result2.rankings) {
          const titleRecord = {
            id: "title-" + 2,
            key: "key-" + records.length,
            name: "Total Power",
            isTitle: true,
            isFirstTitle
          };
          isFirstTitle = false;
          records.push(titleRecord);
          for (let i = 0; i < result2.rankings.length; i++) {
            records.push({
              ...result2.rankings[i],
              rank: i + 1,
              key: "key-" + records.length
            });
          }
        }
      }
      this.records = records;
    },
    scrollUpdated(start, end) {},
    async claimRewards() {
      let items = await this.performRequestNoCatch(
        this.$store.dispatch("battle/claimReward", {
          type: battle.REWARD_TYPE_RANKING
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
      let rewards = battle.RANKING_REWARDS.map((rankEntry, rankIndex) => {
        return { ...rankEntry, position: this.places[rankIndex] };
      });
      return rewards;
    }
  }
};
</script>

<style scoped lang="less">
.battle-rating-rewards-wrapper {
  background: #2f7285;
}
.battle-rating-rewards {
  margin-left: auto;
  margin-right: auto;
}
.icon-rank3-4 {
  filter: hue-rotate(240deg);
}
.icon-rank3-5 {
  filter: hue-rotate(90deg);
}
.common-title {
  height: 40px;
}
.common-title--first {
  background: linear-gradient(to bottom, #2f7285 50%, #245178 50%);
  // background: linear-gradient(to bottom, #2f7285 50%, #303048 50%);
}
</style>
