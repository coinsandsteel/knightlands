<template>
  <div class="height-100 flex flex-column flex-no-wrap flex-items-center flex-end">
    <div v-bar>
      <div class>
        <div class="font-size-18 margin-bottom-3">{{$t("TopDamageDealers-desc")}}</div>

        <div class="flex flex-column width-100">
          <div v-for="(rewards, index) in rewardsPerPlace" :key="index">
            <div class="title digit-font flex flex-center width-100 flex-space-evenly">
              <div class="flex flex-center font-size-20">
                <span>{{rewards.param1}}</span>
                <span v-if="rewards.param2 > rewards.param1">-{{rewards.param2}}</span>
              </div>

              <IconWithValue v-if="rewards.dkt > 0" iconClass="icon-dkt">{{rewards.dkt}}</IconWithValue>
              <IconWithValue
                v-if="rewards.hardCurrency > 0"
                iconClass="icon-premium"
              >{{rewards.hardCurrency}}</IconWithValue>
              <IconWithValue
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
          </div>
        </div>

        <h2 class="title width-100 font-size-20">{{$t("leaderboard")}}</h2>

        <HighscoreLine
          v-for="(record, index) in data"
          :key="record.by"
          :index="index"
          :record="record"
        ></HighscoreLine>

        <div
          v-if="playerIndex==-1"
          class="flex flex-center flex-column margin-top-1 margin-bottom-2"
        >
          <span class="font-size-30 font-weight-700">...</span>
          <HighscoreLine :record="playerRecord" :index="playerIndex"></HighscoreLine>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HighscoreLine from "./../HighscoreLine.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import RaidChallenges from "@/../knightlands-shared/raid_challenge";
import RaidsMeta from "@/raids_meta";
import Loot from "@/components/Loot.vue";
import LootHint from "@/components/LootHint.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ShowHint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

export default {
  props: ["raidData", "data"],
  components: { IconWithValue, Loot, HighscoreLine },
  computed: {
    raidStage() {
      return RaidsMeta[this.raidData.raidTemplateId].stages[
        this.raidData.stage
      ];
    },
    rewardsPerPlace() {
      let challenge = this.raidStage.challenges.find(
        x =>
          x.type.toUpperCase() == RaidChallenges.TopDamageDealers.toUpperCase()
      );

      if (!challenge) {
        return {};
      }

      return challenge.rewards;
    },
    playerRecord() {
      return {
        by: this.$game.account,
        damageDone: this.raidData.currentDamage
      };
    },
    playerIndex() {
      // find player in data
      let playerId = this.$game.account;
      return this.data.findIndex(x => x.by == playerId);
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
