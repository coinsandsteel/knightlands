<template>
  <user-dialog :compact="true" v-on="$listeners">
    <template v-slot:content>
      <div class="flex flex-center flex-column flex-space-between margin-top-1">
        <div v-if="isFreeRaid" class="width-100 flex flex-center flex-column">
          <Title :stackBottom="true">{{ $t("rewards") }}</Title>
          <div class="flex flex-center reward-loot color-panel-1">
            <loot
              v-for="item in loot"
              :item="item.itemId"
              :key="item.itemId"
              :quantity="item.minCount"
              :gacha="true"
              @hint="showHint"
            ></loot>
          </div>
        </div>
        <div
          v-else
          class="width-100 flex flex-center flex-column"
          v-for="(threshold, index) in damageThresholds"
          :key="index"
        >
          <div class="title flex flex-center compact font-size-18">
            <span class="margin-title tier-font">{{ $t("tier") }}</span>
            <span class="title-space tier-font">{{ index + 1 }}</span>
            <span class="margin-title">{{ getDamage(threshold) }}</span>
            <span class="title-space">{{ $t("damage-short") }}</span>
            <span
              v-show="tierUnlocked(threshold)"
              class="icon-mark small"
              :class="{ 'not-last': tierIsNotLast(index) }"
            ></span>
          </div>

          <div class="flex flex-center flex-column margin-bottom-2">
            <IconWithValue
              iconClass="icon-dkt"
              valueClass="font-weight-700"
              class="margin-top-1 margin-bottom-1 font-size-18"
              >{{ getMinDkt(threshold) }} -
              {{ getMaxDkt(threshold) }}</IconWithValue
            >

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
import Title from "@/components/Title.vue";
import LootHint from "@/components/LootHint.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "hideButtons");

export default {
  components: { UserDialog, Loot, IconWithValue, Title },
  props: [
    "raidTemplateId",
    "isFreeRaid",
    "currentDamage",
    "dktFactor",
    "isFirst"
  ],
  computed: {
    meta() {
      return RaidsMeta[this.raidTemplateId];
    },
    data() {
      return this.isFreeRaid ? this.meta.soloData : this.meta.data;
    },
    loot() {
      if (this.isFreeRaid) {
        let loot = this.data.freeLoot.repeatedClearance;
        if (this.isFirst) {
          loot = this.data.freeLoot.firstClearance;
        }

        return loot.damageThresholds[0].lootGuarantees;
      }

      return this.data.paidLoot;
    },
    damageThresholds() {
      return this.loot.damageThresholds;
    }
  },
  methods: {
    getMinDkt(threshold) {
      return (
        Math.floor(
          this.data.maxDkt * 0.7 * threshold.dktReward * this.dktFactor * 10000
        ) / 10000
      );
    },
    getMaxDkt(threshold) {
      return (
        Math.floor(
          this.data.maxDkt * threshold.dktReward * this.dktFactor * 10000
        ) / 10000
      );
    },
    getDamage(threshold) {
      return Math.floor(
        (this.data.health * threshold.relativeThreshold) / this.data.maxSlots
      );
    },
    tierUnlocked(threshold) {
      return this.getDamage(threshold) <= this.currentDamage;
    },
    tierIsNotLast(index) {
      if (index == this.loot.damageThresholds.length - 1) {
        return false;
      }

      return this.tierUnlocked(this.loot.damageThresholds[index + 1]);
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

      await Hint(item, !item.equipped, item.equipped, true);
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

.not-last {
  opacity: 0.4;
}
</style>
