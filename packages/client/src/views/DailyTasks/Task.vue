<template>
  <div class="">
    <Title :stackTop="true" :stackBottom="true">{{ $t(task.type) }}</Title>

    <div
      class="flex flex-center padding-left-1 padding-right-1 stacked-bottom stacked-top"
      :class="panelClass"
    >
      <!-- <div class="loot-slot slot-common flex flex-center flex-column margin-1">
        <div class="inner-border">
          <span :class="taskIcon" class="huge"></span>
        </div>
      </div> -->

      <div class="flex flex-column full-flex margin-1">
        <div class="flex full-flex flex-start flex-column">
          <ProgressBar
            :value="progress"
            :maxValue="maxValue"
            valuePosition="top"
            height="0.75rem"
            width="100%"
            barType="yellow"
            valueClass="white-font font-outline font-size-16"
          ></ProgressBar>
        </div>

        <div class="flex flex-space-evenly margin-top-2">
          <IconWithValue
            v-if="task.soft > 0"
            class="margin-bottom-1"
            iconClass="icon-gold"
            valueClass="font-size-18"
            >{{ task.soft }}</IconWithValue
          >

          <IconWithValue
            v-if="task.exp > 0"
            class="margin-bottom-1"
            iconClass="icon-exp"
            valueClass="font-size-18"
            >{{ task.exp }}</IconWithValue
          >

          <IconWithValue
            v-if="task.hard > 0"
            class="margin-bottom-1"
            valueClass="font-size-18"
            iconClass="icon-premium"
            >{{ task.hard }}</IconWithValue
          >
        </div>

        <div class="flex flex-center reward-loot margin-top-1">
          <loot
            v-for="item in task.loot.guaranteedLootRecords"
            :item="item.itemId"
            :quantity="item.minCount"
            :key="item.itemId"
            @hint="showHint"
          ></loot>
        </div>
      </div>

      <CustomButton
        type="yellow"
        :disabled="!canClaim"
        @click="$emit('claim', task.type)"
        >{{ $t("btn-claim") }}</CustomButton
      >
    </div>
  </div>
</template>

<script>
import HintHandler from "@/components/HintHandler.vue";
import Title from "@/components/Title.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Loot from "@/components/Loot.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import DailyTaskType from "@/../../knightlands-shared/daily_quest_type";
import DailyQuestsMeta from "@/daily_quests";

export default {
  props: ["task", "all"],
  mixins: [HintHandler],
  components: { Title, IconWithValue, Loot, ProgressBar, CustomButton },
  computed: {
    progress() {
      return this.$game.dailyQuests.taskProgress[this.task.type] || 0;
    },
    canClaim() {
      return (
        this.maxValue <= this.progress &&
        !this.$game.dailyQuests.claimedTasks[this.task.type]
      );
    },
    maxValue() {
      return DailyQuestsMeta.questTargets.find(x => x.id == this.task.type)
        .value;
    },
    panelClass() {
      return this.all ? "color-panel-1" : "color-panel-2";
    },
    taskIcon() {
      switch (this.task.type) {
        case DailyTaskType.DailyEnchantItem:
          return "icon-daily-enchant";

        case DailyTaskType.DailyLevelUpItem:
          return "icon-daily-lvl-item";

        case DailyTaskType.DailyBoostBeast:
          return "icon-daily-boost-beast";

        case DailyTaskType.DailySpendGold:
          return "icon-daily-spend-gold";

        case DailyTaskType.DailyTower:
          return "icon-daily-tower";

        case DailyTaskType.DailyArmourTrial:
          return "icon-daily-arm-trial";

        case DailyTaskType.DailyWeaponTrial:
          return "icon-daily-wep-trial";

        case DailyTaskType.DailyAccessoryTrial:
          return "icon-daily-acc-trial";

        case DailyTaskType.DailyEngageQuest:
          return "icon-daily-quest";

        case DailyTaskType.DailySpendPremium:
          return "icon-daily-spend-prem";
      }

      return this.task.type;
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.slot-common {
  background-image: url("../../assets/ui/slot_common.png") !important;
}

.loot-slot {
  position: relative;
  background-image: url("../../assets/ui/item_slot_dark.png");
  background-size: contain;
  background-repeat: no-repeat;

  width: @lootCellSize;
  height: @lootCellSize;
  .mobile({width: @mobileLootCellSize; height: @mobileLootCellSize;});

  .inner-border {
    position: relative;
    width: (100%);
  }
}
</style>
