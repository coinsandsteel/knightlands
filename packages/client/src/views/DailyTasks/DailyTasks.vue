<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div class="full-flex" v-bar>
      <div class="flex flex-column">
        <div
          class="flex flex-center font-size-22 margin-top-2 margin-bottom-3 font-outline font-weight-900"
          v-html="$t('daily-quests-timer', { time: timer.value })"
        ></div>

        <Task
          v-for="(task, index) in tasks"
          :key="index"
          :task="task"
          @claim="claim"
        ></Task>
      </div>
    </div>
  </div>
</template>

<script>
import DailyQuestsMeta from "@/daily_quests";

import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import Timer from "@/timer";
import Task from "./Task.vue";

import { create as CreateDialog } from "vue-modal-dialogs";
import ItemsReceived from "@/components/ItemsReceived.vue";

import DailyTaskType from "@/../../knightlands-shared/daily_quest_type";

const PERIOD = 86400;

const ShowItems = CreateDialog(
  ItemsReceived,
  "items",
  "soft",
  "hard",
  "exp",
  "dkt"
);

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: { Task },
  data: () => ({
    timer: new Timer(true),
    allCompleteTask: {}
  }),
  created() {
    this.title = "window-daily-quests";
    this.allCompleteTask = {
      ...this.meta.allQuestsFinished,
      type: DailyTaskType.DailyAllTasks
    };
    this.timer.timeLeft = PERIOD - (this.$game.nowSec % PERIOD);
  },
  computed: {
    meta() {
      let quest;
      const quests = DailyQuestsMeta.quests;
      for (let i = 0; i < quests.length; ++i) {
        quest = quests[i];

        if (quest.maximumLevel > this.$game.character.level) {
          break;
        }
      }
      return quest;
    },
    tasks() {
      const tasks = this.meta.rewards;
      tasks.sort((x, y) => {
        const xClaimed = this.isClaimed(x);
        const yClaimed = this.isClaimed(y);

        if (xClaimed && yClaimed) {
          return x.order - y.order;
        }

        if (xClaimed) {
          return 1;
        }

        if (yClaimed) {
          return -1;
        }

        const xFinished = this.isFinished(x);
        const yFinished = this.isFinished(y);

        if (xFinished && yFinished) {
          return x.order - y.order;
        }

        if (xFinished) {
          return -1;
        }

        if (yFinished) {
          return 1;
        }

        return x.order - y.order;
      });
      return tasks;
    }
  },
  methods: {
    isFinished(task) {
      const progress = this.$game.dailyQuests.taskProgress[task.type] || 0;
      return task.targetValue <= progress;
    },
    isClaimed(task) {
      return !!this.$game.dailyQuests.claimedTasks[task.type];
    },
    async claim(type) {
      const rewards = await this.performRequest(
        this.$game.claimDailyQuestsRewards(type)
      );

      await ShowItems(rewards.items, rewards.soft, rewards.hard, rewards.exp);
    }
  }
};
</script>
