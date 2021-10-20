<template>
  <div class="screen-content flex-items-center full-flex">
    <div class="screen-background"></div>
    <div class="width-100" v-bar>
      <div class="flex relative flex-items-center padding-top-1 padding-bottom-5">
        <Title class="font-outline" :stackBottom="true">{{
          $t("dungeon")
        }}</Title>

        <EnemyView
          ref="enemyView"
          :image="enemyImage"
          background="/images/tower.png"
        />

        <Maze />
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import EnemyView from "@/components/EnemyView.vue";
import Maze from "@/components/Maze.vue";
import AppSection from "@/AppSection.vue";

export default {
  mixins: [AppSection],
  components: {
    Title,
    EnemyView,
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
