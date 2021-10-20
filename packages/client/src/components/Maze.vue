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
    maze: null
  }),
  computed: {},
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.maze = new Maze(this.$refs.canvas, this.$refs.wrapper);
      this.maze.render();
    }
  }
};
</script>