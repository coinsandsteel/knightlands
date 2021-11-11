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
        <div class="flex flex-center flex-space-evenly margin-bottom-2">
          <IconWithValue
            v-if="task.soft > 0"
            class="margin-bottom-1"
            iconClass="icon-gold medium"
            valueClass="font-size-20 font-outline"
            >{{ task.soft }}</IconWithValue
          >

          <IconWithValue
            v-if="task.exp > 0"
            class="margin-bottom-1"
            iconClass="icon-exp medium"
            valueClass="font-size-20 font-outline"
            >{{ task.exp }}</IconWithValue
          >

          <IconWithValue
            v-if="task.hard > 0"
            class="margin-bottom-1"
            valueClass="font-size-20 font-outline"
            iconClass="icon-premium medium"
            >{{ task.hard }}</IconWithValue
          >

          <loot
            v-for="item in task.loot.guaranteedLootRecords"
            :item="item.itemId"
            :quantity="item.minCount"
            :key="item.itemId"
            @hint="handleHint"
          ></loot>
        </div>

        <ProgressBar
          :value="progress"
          :maxValue="maxValue"
          valuePosition="top"
          height="0.75rem"
          barType="yellow"
          class=""
          valueClass="white-font font-outline font-size-16"
        ></ProgressBar>
      </div>

      <CustomButton
        class="flex-self-end"
        type="yellow"
        :disabled="!canClaim"
        v-if="notClaimed"
        @click="$emit('claim', task.type)"
        >{{ $t("btn-claim") }}</CustomButton
      >
      <CustomButton class="flex-self-end" type="grey" :disabled="true" v-else>{{
        $t("claimed")
      }}</CustomButton>
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

export default {
  props: ["task"],
  mixins: [HintHandler],
  components: { Title, IconWithValue, Loot, ProgressBar, CustomButton },
  computed: {
    progress() {
      return this.$game.dailyQuests.taskProgress[this.task.type] || 0;
    },
    canClaim() {
      return this.maxValue <= this.progress && this.notClaimed;
    },
    notClaimed() {
      return !this.$game.dailyQuests.claimedTasks[this.task.type];
    },
    maxValue() {
      return this.task.targetValue;
    },
    panelClass() {
      return this.all ? "color-panel-1" : "color-panel-2";
    },
    all() {
      switch (this.task.type) {
        case DailyTaskType.DailyAllTasks:
        case DailyTaskType.DailyAllTasks2:
        case DailyTaskType.DailyAllTasks3:
          return true;
      }

      return false;
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
