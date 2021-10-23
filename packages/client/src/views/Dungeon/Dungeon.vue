<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="screen-background"></div>
    <div class="width-100" v-bar>
      <div class="flex relative flex-items-center padding-top-1 padding-bottom-5">
        <Maze />
      </div>
    </div>
  </div>
</template>

<script>
import Maze from "@/components/Maze.vue";
import AppSection from "@/AppSection.vue";

export default {
  mixins: [AppSection],
  components: {
    Maze
  },
  data: () => ({}),
  created() {
    this.title = "w-simple-dun";
  },
  computed: {
    enemyImage() {
      return "Insects Giant Bug Centipede";
    }
  },
  methods: {}
};
</script>
