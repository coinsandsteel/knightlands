<template>
  <div class="height-100 flex flex-column flex-no-wrap flex-items-center">
    <div class="width-100" v-bar>
      <div class="width-100">
        <Title class="font-size-18 margin-bottom-3">{{ $t("rewards") }}</Title>

        <div
          class="flex width-100 font-size-20 padding-left-3 padding-bottom-2 padding-right-3"
        >
          <div class="flex-1 flex flex-column flex-items-start">
            <div
              class="flex flex-center padding-bottom-1"
              v-for="(rewards, index) in rewardsPerPlace"
              :key="index"
            >
              <span>#{{ rewards.param1 }}</span>
              <span v-if="rewards.param2 > rewards.param1"
                >-{{ rewards.param2 }}</span
              >
            </div>
          </div>

          <div class="flex-1 flex flex-column flex-items-start" v-if="hasDkt">
            <IconWithValue
              v-for="(rewards, index) in rewardsPerPlace"
              :key="index"
              class="padding-bottom-1"
              iconClass="icon-dkt"
              >{{ rewards.dkt }}</IconWithValue
            >
          </div>

          <div class="flex-1 flex flex-column flex-items-start">
            <IconWithValue
              v-for="(rewards, index) in rewardsPerPlace"
              :key="index"
              class="padding-bottom-1"
              iconClass="icon-premium"
              >{{ rewards.hardCurrency }}</IconWithValue
            >
          </div>

          <div class="flex-1 flex flex-column flex-items-start">
            <IconWithValue
              v-for="(rewards, index) in rewardsPerPlace"
              :key="index"
              class="padding-bottom-1"
              iconClass="icon-gold"
              >{{ rewards.softCurrency }}</IconWithValue
            >
          </div>

          <!-- <div v-for="(rewards, index) in rewardsPerPlace" :key="index">
            <div class="title digit-font flex flex-center width-100 flex-space-evenly">
              <div class="flex flex-center font-size-20 full-flex">
                <span>{{rewards.param1}}</span>
                <span v-if="rewards.param2 > rewards.param1">-{{rewards.param2}}</span>
              </div>

              <IconWithValue
                class="full-flex"
                v-if="rewards.dkt > 0"
                iconClass="icon-dkt"
              >{{rewards.dkt}}</IconWithValue>
              <IconWithValue
                class="full-flex"
                v-if="rewards.hardCurrency > 0"
                iconClass="icon-premium"
              >{{rewards.hardCurrency}}</IconWithValue>
              <IconWithValue
                class="full-flex"
                v-if="rewards.softCurrency > 0"
                iconClass="icon-gold"
              >{{rewards.softCurrency}}</IconWithValue>
            </div>

            <div class="margin-top-1 margin-bottom-2 flex flex-center">
              <loot
                v-for="loot in rewards.loot.guaranteedLootRecords"
                :key="loot.itemId"
                :item="loot.itemId"
                :quantity="loot.maxCount"
                @hint="showHint"
              ></loot>
            </div>
          </div>-->
        </div>

        <Title class="margin-bottom-2">{{ $t("leaderboard") }}</Title>

        <div class="width-100 padding-left-3 padding-right-3">
          <HighscoreLine
            class="width-100 flex-start"
            v-for="(record, index) in data"
            :key="record.by"
            :index="index"
            :record="record"
          ></HighscoreLine>
        </div>

        <div
          v-if="playerIndex === -1"
          class="flex flex-items-center flex-column margin-top-1 margin-bottom-2 padding-left-3 padding-right-3"
        >
          <span class="font-size-30 font-weight-700">...</span>
          <HighscoreLine
            :record="playerRecord"
            :index="playerIndex"
          ></HighscoreLine>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HighscoreLine from "./../HighscoreLine.vue";
import RaidGetterMixin from "../RaidGetterMixin.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import RaidChallenges from "@/../../knightlands-shared/raid_challenge";
import LootHint from "@/components/LootHint.vue";
import Title from "@/components/Title.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ShowHint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

export default {
  props: ["raidState", "data"],
  mixins: [RaidGetterMixin],
  components: { IconWithValue, HighscoreLine, Title },
  watch: {
    raidState: {
      immediate: true,
      handler() {
        this.raid = this.raidState.raidTemplateId;
      }
    }
  },
  computed: {
    hasDkt() {
      return this.rewardsPerPlace[0].dkt > 0;
    },
    totalRewardsPerPlace() {
      let totalRewards = 0;
      if (this.rewardsPerPlace) {
        const rewards = this.rewardsPerPlace[0];
        totalRewards = Object.keys(rewards).length;
      }

      return totalRewards;
    },
    isFreeRaid() {
      return this.raidState.isFree;
    },
    rewardsPerPlace() {
      let challenge = this.raidData.challenges.find(
        x =>
          x.type.toUpperCase() == RaidChallenges.TopDamageDealers.toUpperCase()
      );

      if (!challenge) {
        return undefined;
      }

      return challenge.rewards;
    },
    playerRecord() {
      const damage = this.raidState.participants[this.$game.id];

      return {
        by: this.$game.account,
        damageDone: damage || 0
      };
    },
    playerIndex() {
      return this.data.findIndex(x => x.by == this.$game.id);
    }
  },
  methods: {
    async showHint(item) {
      await ShowHint(item, false, false, { equip: false });
    }
  }
};
</script>

<style lang="less" scoped>
.scrollable-content {
  max-height: 80vh;
}
</style>
