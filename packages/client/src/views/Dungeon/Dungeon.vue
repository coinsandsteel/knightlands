<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="screen-background"></div>
    <Title class="enemy-title-font margin-top-1 margin-bottom-1 font-outline">{{
      $t("level-full", { lvl: maze.floor })
    }}</Title>

    <div class="flex flex-center panel-input padding-1">
      <div class="icon-timer small margin-right-half"></div>
      <span class="font-size-18">{{ timer.value }}</span>
      <CustomButton @click="resetDungeon">Reset dungeon</CustomButton>
    </div>

    <div class="width-100 margin-top-2 margin-bottom-2">
      <ProgressBar
        :value="user.health"
        :maxValue="1357"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="red"
        valueClass="white-font font-outline font-size-20"
        class="margin-bottom-1"
      >
        <template v-slot:label>Dungeon HP&nbsp;&ndash;&nbsp;</template>
      </ProgressBar>

      <ProgressBar
        :value="user.energy"
        :maxValue="935"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="blue"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label>Dungeon Energy&nbsp;&ndash;&nbsp;</template>
      </ProgressBar>
    </div>

    <div class="width-100" v-bar>
      <div class="flex relative flex-items-center padding-top-1">
        <Maze />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import Maze from "./MazeView.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import UiConstants from "@/ui_constants";
import ProgressBar from "@/components/ProgressBar.vue";
import Timer from "@/timer";
import PromptMixin from "@/components/PromptMixin.vue";

const PERIOD = 86400;

export default {
  mixins: [AppSection, PromptMixin],
  components: {
    Maze,
    Title,
    ProgressBar,
    CustomButton
  },
  data: () => ({
    thresholds: UiConstants.progressThresholds,
    timer: new Timer(true)
  }),
  created() {
    this.title = "w-simple-dun";
    this.timer.timeLeft = PERIOD - (this.$game.nowSec % PERIOD);
  },
  computed: {
    ...mapState({
      maze: state => state.dungeon.maze,
      user: state => state.dungeon.user
    })
  },
  methods: {
    async resetDungeon() {
      await this.$store.dispatch("dungeon/reset");
    }
  }
};
</script>
