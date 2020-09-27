<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div class="full-flex" v-bar>
      <div class="flex flex-column">
        <div
          class="flex flex-center font-size-22 margin-top-1 margin-bottom-3 font-outline font-weight-900"
          v-html="$t('daily-quests-timer', { time: timer.value })"
        ></div>

        <Task :task="allCompleteTask" :all="true" @claim="claim"></Task>
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
    this.timer.timeLeft = Math.floor(this.$game.now % 86400000) / 1000;
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
      return this.meta.rewards;
    }
  },
  methods: {
    async claim(type) {
      const rewards = await this.performRequest(
        this.$game.claimDailyQuestsRewards(type)
      );

      await ShowItems(rewards.items, rewards.soft, rewards.hard, rewards.exp);
    }
  }
};
</script>
