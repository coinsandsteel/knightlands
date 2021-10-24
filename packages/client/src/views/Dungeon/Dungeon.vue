<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="screen-background"></div>
    <div class="width-100" v-bar>
      <div
        class="flex relative flex-items-center padding-top-1 padding-bottom-5"
      >
        <Maze :dungeon="dungeon" @move="handleMoveToCell" />
      </div>
    </div>
  </div>
</template>

<script>
import Maze from "./MazeView.vue";
import AppSection from "@/AppSection.vue";
import Events from "@/../../knightlands-shared/events";

export default {
  mixins: [AppSection],
  components: {
    Maze
  },
  data: () => ({
    dungeon: null
  }),
  created() {
    this.title = "w-simple-dun";
  },
  async mounted() {
    this.dungeon = await this.$game.getDungeon();

    this._updateHandler = this.handleDungeonUpdate.bind(this);
    this.$game.onNetwork(Events.SDungeonUpdate, this._updateHandler);
  },
  destroyed() {
    this.$game.offNetwork(Events.SDungeonUpdate, this._updateHandler);
  },
  methods: {
    async handleMoveToCell(cellIndex) {
      await this.$game.revealDungeonCell(cellIndex);
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
