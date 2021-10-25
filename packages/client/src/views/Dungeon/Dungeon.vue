<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="screen-background"></div>
    <Title class="enemy-title-font margin-top-1 margin-bottom-1 font-outline">{{
      $t("level-full", { lvl: 1 })
    }}</Title>

    <div class="flex flex-center panel-input padding-1">
      <div class="icon-timer small margin-right-half"></div>
      <span class="font-size-18">{{ timer.value }}</span>
    </div>

    <div class="width-100 margin-top-2 margin-bottom-2">
      <ProgressBar
        :value="1200"
        :maxValue="1357"
        height="4px"
        width="90%"
        valuePosition="top"
        barType="red"
        valueClass="white-font font-outline font-size-20"
        class="margin-bottom-1"
      >
        <template v-slot:label>Dungeon XP&nbsp;&ndash;&nbsp;</template>
      </ProgressBar>

      <ProgressBar
        :value="870"
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
      <div
        class="flex relative flex-items-center padding-top-1 padding-bottom-5"
      >
        <Maze
          :dungeon="dungeon"
          @reveal="revealCell"
          @interact="interactWithCell"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Maze from "./MazeView.vue";
import AppSection from "@/AppSection.vue";
import Events from "@/../../knightlands-shared/events";
import Title from "@/components/Title.vue";
import UiConstants from "@/ui_constants";
import ProgressBar from "@/components/ProgressBar.vue";
import Timer from "@/timer";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [AppSection, PromptMixin],
  components: {
    Maze,
    Title,
    ProgressBar
  },
  data: () => ({
    dungeon: null,
    thresholds: UiConstants.progressThresholds,
    timer: new Timer(true)
  }),
  created() {
    this.title = "w-simple-dun";
    this.timer.timeLeft = 3600 * 4 - 961;
  },
  async mounted() {
    this.dungeon = await this.$game.getDungeon();
    this._updateHandler = this.handleDungeonUpdate.bind(this);
    this.$game.onNetwork(Events.SDungeonUpdate, this._updateHandler);

    if (this.dungeon.combat) {
      this.$router.push({ name: "dungeon-fight", params: { id: 1 } });
      return;
    }
  },
  destroyed() {
    this.$game.offNetwork(Events.SDungeonUpdate, this._updateHandler);
  },
  methods: {
    async revealCell(cellIndex) {
      await this.$game.revealDungeonCell(cellIndex);
    },
    async interactWithCell(cellIndex, revealedIndex) {
      const cell = this.dungeon.revealed[revealedIndex];

      if (cellIndex == this.dungeon.user.cell) {
        // can interact with objects where user stands

        if (cell.enemy) {
          // show pre-combat dialog
          await this.showPrompt(
            this.$t("enemy-aggressive-h"),
            this.$t("enemy-aggressive-t"),
            [
              {
                type: "red",
                title: "fight-it",
                response: true
              }
            ]
          );
          // Redirect to fight
          this.$router.push({ name: "dungeon-fight", params: { id: 1 } });
        } else if (cell.altar) {
          // show altar dialog
        } else if (cell.trap) {
          // show trap dialog
          await this.showPrompt(this.$t("trap-h"), this.$t("trap-t"), [
            {
              type: "red",
              title: "btn-ok",
              response: true
            }
          ]);
        }

        // interact with the object in the cell
        await this.$game.useDungeonCell(cellIndex);
      } else {
        await this.$game.moveToDungeonCell(cellIndex);
      }
    },
    handleDungeonUpdate(data) {
      console.log("update dungeon", data);
      if (data.cell) {
        this.dungeon.revealed.push(data.cell);
      }

      if (data.moveTo) {
        this.dungeon.user.cell = data.moveTo;
      }
    }
  }
};
</script>
