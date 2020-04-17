<template>
  <user-dialog :compact="true" @close="$emit('close')">
    <template v-slot:content>
      <div class="flex flex-center flex-column flex-space-between">
        <div
          class="width-100 flex flex-center flex-column"
          v-for="(threshold, index) in loot.damageThresholds"
          :key="index"
        >
          <div class="title flex flex-center compact font-size-18">
            <span class="margin-title tier-font">{{$t("tier")}}</span>
            <span class="title-space tier-font">{{index+1}}</span>
            <span class="margin-title">{{getDamage(threshold)}}</span>
            <span class="title-space">{{$t("damage-short")}}</span>
            <span v-show="tierUnlocked(threshold)" class="icon-mark small"></span>
          </div>

          <div class="flex flex-center flex-column margin-bottom-2">
            <IconWithValue
              iconClass="icon-dkt"
              valueClass="font-weight-700"
              class="margin-top-1 margin-bottom-1 font-size-18"
            >{{getMinDkt(threshold)}} - {{getMaxDkt(threshold)}}</IconWithValue>

            <div class="flex flex-center reward-loot">
              <loot
                v-for="item in threshold.lootGuarantees"
                :item="item.itemId"
                :key="item.itemId"
                :quantity="item.minCount"
                :gacha="true"
                @hint="showHint"
              ></loot>
            </div>

            <div class="flex flex-center compact width-100 font-size-18 margin-top-1 margin-bottom-1">{{$t("raid-possible-loot")}}</div>

            <div class="flex flex-center reward-loot">
              <loot
                v-for="item in threshold.lootPreview"
                :item="item.itemId"
                :key="item.itemId"
                :gacha="true"
                @hint="showHint"
              ></loot>
            </div>
          </div>
        </div>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import RaidsMeta from "@/raids_meta";
import Loot from "@/components/Loot.vue";
import LootHint from "@/components/LootHint.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "hideButtons");

export default {
  components: { UserDialog, Loot, IconWithValue },
  props: ["raidTemplateId", "stage", "currentDamage", "dktFactor"],
  computed: {
    meta() {
      return RaidsMeta[this.raidTemplateId];
    },
    stageData() {
      return this.meta.stages[this.stage];
    },
    loot() {
      return this.stageData.loot;
    }
  },
  methods: {
    getMinDkt(threshold) {
      return (
        Math.floor(
          this.stageData.minDkt * threshold.dktReward * this.dktFactor
        ) / 100
      );
    },
    getMaxDkt(threshold) {
      return (
        Math.floor(
          this.stageData.maxDkt * threshold.dktReward * this.dktFactor
        ) / 100
      );
    },
    getDamage(threshold) {
      return Math.floor(
        (this.stageData.health * threshold.relativeThreshold) /
          this.stageData.maxSlots
      );
    },
    tierUnlocked(threshold) {
      return this.getDamage(threshold) <= this.currentDamage;
    },
    extractItems(threshold) {
      let table = this.loot.lootTables[
        threshold.lootTableIndicies[threshold.lootTableIndicies.length - 1]
      ];
      let lootPreviews = [];

      this.createLootPreviews(table.guaranteedLootRecords, lootPreviews);
      this.createLootPreviews(table.lootRecords, lootPreviews);

      return lootPreviews;
    },
    createLootPreviews(records, lootPreviews) {
      let i = 0;
      const length = records.length;
      for (; i < length; ++i) {
        lootPreviews.push({
          id: records[i].itemId,
          template: records[i].itemId
        });
      }
    },
    async showHint(item) {
      if (!item) {
        return;
      }

      let action = await Hint(item, !item.equipped, item.equipped, true);
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  width: 75%;
}

.margin-title {
  margin-right: 0.3rem;
}

.title-space {
  margin-right: 0.8rem;
}

.tier-font {
  color: #fdc64f;
}
</style>