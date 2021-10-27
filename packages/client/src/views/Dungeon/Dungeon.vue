<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="hallowen-bg"></div>
    <Title class="enemy-title-font margin-top-1 margin-bottom-1 font-outline">{{
      $t("level-full", { lvl: maze.floor })
    }}</Title>

    <div class="flex flex-center panel-input padding-1">
      <div class="icon-timer small margin-right-half"></div>
      <span class="font-size-18">{{ timer.value }}</span>
      <CustomButton @click="resetDungeon">Reset dungeon</CustomButton>
    </div>

    <div class="width-100 margin-top-2 margin-bottom-2 stat-panel">
      <ProgressBar
        :value="user.health"
        :maxValue="stats.maxHealth"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="red"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span class="icon-health"></span></template>
      </ProgressBar>

      <ProgressBar
        :value="user.energy"
        :maxValue="stats.maxEnergy"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="blue"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span class="icon-energy"></span></template>
      </ProgressBar>

      <ProgressBar
        :value="user.exp"
        :maxValue="nextExp"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="grey"
        valueClass="white-font font-outline font-size-20"
      >
        <template v-slot:label><span class="icon-exp"></span></template>
      </ProgressBar>

      <div class="flex flex-center">
        <CustomButton
          type="grey"
          @click="usePotion"
          :disabled="user.potion == 0"
          >Use potion {{ user.potion }}</CustomButton
        >
        <CustomButton
          type="grey"
          @click="useScroll"
          :disabled="user.scroll == 0"
          >Use scroll {{ user.scroll }}</CustomButton
        >
      </div>
    </div>
    <Maze />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import CustomButton from "@/components/Button.vue";
import Maze from "./MazeView.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import UiConstants from "@/ui_constants";
import ProgressBar from "@/components/ProgressBar.vue";
import Timer from "@/timer";

const PERIOD = 86400;

export default {
  mixins: [AppSection],
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
  activated() {
    console.log("Dungeon:activated");
    this.$store.dispatch("dungeon/redirectToActiveCombat");
  },
  computed: {
    ...mapState({
      maze: state => state.dungeon.maze,
      user: state => state.dungeon.user,
      combat: state => state.dungeon.combat
    }),
    ...mapGetters({
      stats: "dungeon/playerStats",
      nextExp: "dungeon/nextExp"
    })
  },
  methods: {
    async resetDungeon() {
      await this.$store.dispatch("dungeon/reset");
    },
    async usePotion() {
      await this.$store.dispatch("dungeon/useItem", "potion");
    },
    async useScroll() {
      await this.$store.dispatch("dungeon/useItem", "scroll");
    }
  }
};
</script>

<style lang="less" scoped>
.hallowen-bg {
  background-color: #40374d;
  z-index: -1;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.stat-panel {
  display: grid;
  justify-content: center;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  row-gap: 2rem;
}
</style>
