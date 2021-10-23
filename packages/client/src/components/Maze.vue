<template>
  <div class="width-100" ref="wrapper">
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>

<script>
import Maze from "@/maze";

export default {
  mixins: [],
  components: {},
  data: () => ({
    interval: null,
    maze: null,
    meta: {
      backgrounds: {
        closed: "tile_empty1",
        loot: "tile_empty",
        item_background: "tile_back1",
        way_single: "way4",
        way_straight: "way1",
        way_turn: "way2",
        way_all: "way3",
        way_triple: "way5"
      }
    }
  }),
  computed: {},
  async mounted() {
    await this.getDungeon();
    this.render();
  },
  methods: {
    async getDungeon() {
      this.data = await this.$game.getDungeon();
      console.log('Dungeon data', { data: this.data });
    },
    render() {
      console.log("Render started", new Date().toISOString());
      this.maze = new Maze(
        this.data,
        this.meta,
        this.$refs.canvas,
        this.$refs.wrapper,
        this.$game
      );
      this.maze.render();
    }
  }
};
</script>
