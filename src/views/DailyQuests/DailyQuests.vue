<template>
  <div class="flex flex-column">
    <StripedPanel class="padding-top-2 margin-1">
      <span
        class="font-size-25 width-100 margin-bottom-3"
        v-html="$t('daily-quests-total-ap', {ap: $game.dailyQuests().points})"
      ></span>

      <div class="center relative width-90 margin-top-5">
        <!-- DAILY POINTS PROGRESS -->
        <div class="flex flex-no-wrap flex-items-end absolute-stretch">
          <PointsMilestone :points="0"></PointsMilestone>
          <PointsMilestone
            v-for="(reward, index) in rewards"
            :key="index"
            :points="reward.pointsRequired"
            :style="{ width: `${100/rewards.length}%`}"
          ></PointsMilestone>
        </div>

        <ProgressBar
          v-model="currentPoints"
          :maxValue="maxPoints"
          :hideMaxValue="true"
          :hideValues="true"
          width="100%"
          valuePosition="top"
          barType="yellow"
          valueClass="white-font font-outline font-size-18"
        ></ProgressBar>
      </div>

      <StripedContent
        classes="margin-top-5 margin-bottom-5"
        contentClasses="width-100 flex flex-space-evenly"
        stripeHeight="13rem"
      >
        <div class="flex flex-no-wrap flex-space-evenly">
          <!-- TASK LIST -->
          <span
            v-for="(task, idx) in taskList"
            :key="idx"
            class="task-icon"
            :class="taskIcon(task.type)"
            @click="selectQuest(idx)"
          ></span>
        </div>
      </StripedContent>

      <div class="flex flex-column">
        <!-- SELECTED TASK -->
        <span
          class="font-size-22 margin-bottom-half font-weight-900 title"
        >{{$t(currentQuest.type)}}</span>

        <div class="font-size-18 margin-bottom-2">
          <span class="green-title margin-right-half">{{$t('daily-quest-progress')}}</span>
          <span
            v-if="isActiveQuest(currentQuestIndex)"
          >{{`${activeQuestProgress}/${currentQuest.value}`}}</span>
          <span v-else>{{`0/${currentQuest.value}`}}</span>
        </div>

        <div class="flex flex-space-around">
          <div class="flex flex-column font-size-18">
            <div class="margin-bottom-half">
              <span class="margin-right-half">Rarity:</span>
              <span
                :class="`rarity-${currentQuest.rarity}`"
                class="font-weight-700"
              >{{$t(currentQuest.rarity)}}</span>
            </div>
            <span>{{$t("daily-quests-ap", {ap: currentTaskMeta.points})}}</span>
          </div>

          <div class="flex flex-column">
            <IconWithValue
              class="margin-bottom-half flex-start"
              iconClass="icon-gold"
              valueClass="font-size-18"
            >{{currentTaskMeta.soft}}</IconWithValue>
            <IconWithValue
              class="flex-start"
              iconClass="icon-exp"
              valueClass="font-size-18"
            >{{currentTaskMeta.exp}}</IconWithValue>
          </div>
        </div>

        <div class="flex flex-center">
          <span
            v-if="isFinished(currentQuestIndex)"
            class="font-size-22 font-weight-900 orange-title"
          >{{$t("daily-quest-finished")}}</span>

          <CustomButton
            v-else-if="isActiveQuest(currentQuestIndex)"
            type="yellow"
            @click="jumpToCurrentTask"
          >{{$t("daily-quests-go")}}</CustomButton>

          <CustomButton
            v-else
            type="yellow"
            @click="acceptTask(currentQuestIndex)"
          >{{$t("daily-quests-accept")}}</CustomButton>
        </div>
      </div>
    </StripedPanel>

    <div class="margin-top-3">
      <!-- COMPLETED TASKS PROGRESS -->
      <ProgressBar
        v-model="$game.dailyQuests().completedTasksCount"
        :maxValue="meta.maxQuestsToComplete"
        height="0.75rem"
        width="80%"
        valuePosition="top"
        barType="yellow"
        valueClass="white-font font-outline font-size-18"
      >
        <template v-slot:label>
          <span class="margin-right-half">Completed Tasks:</span>
        </template>
      </ProgressBar>
      <div class="font-size-18 margin-top-2">{{$t("daily-quests-timer", {time: timer.value})}}</div>
    </div>

    <div class="flex flex-space-evenly margin-top-1">
      <!-- BOTTOM BUTTONS -->
      <div class="flex flex-column">
        <span class="font-size-18">{{$t("daily-quests-refreshes", {count: attemptsIap.count})}}</span>
        <PromisedButton type="green" :promise="request">
          <PriceTag :iap="attemptsIap.iap" :dark="true"></PriceTag>
        </PromisedButton>
      </div>

      <div class="flex flex-column">
        <span class="font-size-18">Free refreshes: {{freeRefreshes}}</span>
        <PromisedButton
          type="blue"
          @click="refreshTasks"
          :promise="request"
        >{{$t("daily-quests-refresh")}}</PromisedButton>
      </div>

      <div class="flex flex-column">
        <span class="font-size-18">&nbsp;</span>
        <PromisedButton
          type="yellow"
          @click="claimRewards"
          :disabled="!canClaimRewards"
          :promise="request"
        >{{$t("daily-quests-claim")}}</PromisedButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import ProgressBar from "@/components/ProgressBar.vue";
import PointsMilestone from "./PointsMilestone.vue";
import DailyQuestsMeta from "@/daily_quests";
import PromisedButton from "@/components/PromisedButton.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import PriceTag from "@/components/PriceTag.vue";
import CustomButton from "@/components/Button.vue";
import DailyTaskType from "@/../knightlands-shared/daily_quest_type";
import PromptMixin from "@/components/PromptMixin.vue";
import Timer from "@/timer";
import ItemsReceived from "@/components/ItemsReceived.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ShowItems = CreateDialog(ItemsReceived, "items", "soft", "hard", "exp", "dkt");

export default {
  mixins: [AppSection, PromptMixin],
  components: {
    ProgressBar,
    PointsMilestone,
    PromisedButton,
    IconWithValue,
    StripedPanel,
    StripedContent,
    CustomButton,
    PriceTag
  },
  created() {
    this.title = "window-daily-quests";
  },
  data: () => ({
    meta: DailyQuestsMeta,
    currentQuest: {},
    currentQuestIndex: -1,
    timer: new Timer(true),
    request: null
  }),
  mounted() {
    this.selectQuest(0);
    this.timer.timeLeft = Math.floor(this.$game.now % 86400000) / 1000;
  },
  computed: {
    rewards() {
      let rewards;
      for (let reward of DailyQuestsMeta.rewards) {
        if (reward.maximumLevel >= this.$game.character.level) {
          rewards = reward;
        }
      }

      return rewards.rewards;
    },
    maxPoints() {
      return this.rewards[this.rewards.length - 1].pointsRequired;
    },
    activeQuestProgress() {
      if (!this.hasActiveQuest) return 0;
      return this.$game.dailyQuests().currentTask.progress;
    },
    attemptsIap() {
      return DailyQuestsMeta.iaps[0];
    },
    taskList() {
      return this.$game.dailyQuests().tasks;
    },
    currentTaskMeta() {
      if (!this.currentQuest.rarity) {
        return {};
      }

      let rules = DailyQuestsMeta.rarityRules.find(
        x => x.rarity == this.currentQuest.rarity
      );
      return rules;
    },
    hasActiveQuest() {
      const currentTask = this.$game.dailyQuests().currentTask;
      return !!currentTask && currentTask.progress < currentTask.maxProgress;
    },
    currentPoints() {
      return this.$game.dailyQuests().points;
    },
    freeRefreshes() {
      return this.$game.dailyQuests().freeRefreshes;
    },
    canClaimRewards() {
      const dq = this.$game.dailyQuests();
      let canClaim = false;
      for (let index = 0; index < dq.rewards.length; index++) {
        const rewardRecord = dq.rewards[index];
        if (
          rewardRecord.pointsRequired > dq.claimedPoints &&
          rewardRecord.pointsRequired <= dq.points
        ) {
          canClaim = true;
          break;
        }
      }
      return canClaim;
    }
  },
  methods: {
    async acceptTask() {
      let response = true;

      if (this.hasActiveQuest) {
        response = await this.showPrompt(
          this.$t("confirm-action-title"),
          this.$t("daily-quest-accept-content", {
            task: this.$t(this.currentQuest.type)
          }),
          [
            {
              type: "yellow",
              title: "daily-quest-accept",
              response: true
            }
          ]
        );
      }

      if (response === true) {
        await this.$game.acceptDailyQuest(this.currentQuestIndex);
      }
    },
    isActiveQuest(questIndex) {
      const currentTask = this.$game.dailyQuests().currentTask;
      return this.hasActiveQuest && currentTask.index == questIndex;
    },
    isFinished(questIndex) {
      return this.$game.dailyQuests().completedTasks[questIndex];
    },
    taskIcon(type) {
      switch (type) {
        case DailyTaskType.DailyEnchantItem:
          return "icon-enchant";

        case DailyTaskType.DailyLevelUpItem:
          return "icon-craft-level";

        case DailyTaskType.DailyBoostBeast:
          return "icon-enchant";

        case DailyTaskType.DailySpendGold:
          return "icon-goldExchange";

        case DailyTaskType.DailyTower:
          return "icon-tower";

        case DailyTaskType.DailyArmourTrial:
          return "icon-trials";

        case DailyTaskType.DailyWeaponTrial:
          return "icon-trials";

        case DailyTaskType.DailyAccessoryTrial:
          return "icon-trials";

        case DailyTaskType.DailyEngageQuest:
          return "icon-quests";

        case DailyTaskType.DailySpendPremium:
          return "icon-shop";
      }

      return type;
    },
    jumpToCurrentTask() {
      switch (this.currentQuest.type) {
        case DailyTaskType.DailyEnchantItem:
          this.$router.push({ name: "crafting-enchant" });
          break;
        case DailyTaskType.DailyLevelUpItem:
          this.$router.push({ name: "crafting-upgrade" });
          break;
        case DailyTaskType.DailyBoostBeast:
          this.$router.push({ name: "character-beast" });
          break;
        case DailyTaskType.DailySpendGold:
          this.$router.push({ name: "character-beast" });
          break;
        case DailyTaskType.DailyTower:
          this.$router.push({ name: "onyx-tower" });
          break;
        case DailyTaskType.DailyArmourTrial:
          this.$router.push({ name: "trial-honor" });
          break;
        case DailyTaskType.DailyWeaponTrial:
          this.$router.push({ name: "trial-conjured" });
          break;
        case DailyTaskType.DailyAccessoryTrial:
          this.$router.push({ name: "" });
          break;
        case DailyTaskType.DailyEngageQuest:
          this.$router.push({ name: "quests" });
          break;
        case DailyTaskType.DailySpendPremium:
          this.$router.push({ name: "character-beast" });
          break;
      }
    },
    selectQuest(idx) {
      this.currentQuest = this.taskList[idx];
      this.currentQuestIndex = idx;
    },
    async refreshTasks() {
      if (this.freeRefreshes > 0) {
        await this.$game.refreshDailyQuests();
      }
    },
    async claimRewards() {
      this.request = this.$game.claimDailyQuestsRewards();
      let items = await this.request;
      await ShowItems(items);
    }
  }
};
</script>

<style lang="less" scoped>
.task-icon {
  width: 6rem;
  height: 6rem;
}
</style>