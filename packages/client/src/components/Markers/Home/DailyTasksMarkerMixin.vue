<script>
import DailyQuestsMeta from "@/daily_quests";

export default {
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
    canClaimDailyTask() {
      for (const task of this.meta.rewards) {
        if (this.isFinished(task)) {
          return true;
        }
      }

      return false;
    }
  },
  methods: {
    isFinished(task) {
      const progress = this.$game.dailyQuests.taskProgress[task.type] || 0;
      return (
        !this.$game.dailyQuests.claimedTasks[task.type] &&
        task.targetValue <= progress
      );
    }
  }
};
</script>
