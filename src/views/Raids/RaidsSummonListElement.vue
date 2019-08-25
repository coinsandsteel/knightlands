<template>
  <div class="flex raid-summon-element panel-light">
    <div class="flex flex-column flex-center full-flex">
      <div class="title font-size-20 enemy-title-font">{{meta.name}}</div>
      <div class="pixelated boss-image" :style="enemyImage"></div>
    </div>
    <div class="flex flex-column full-flex flex-space-around">
      <DifficultySelector :stages="stages" :preview="true" :stagesState="stageStates"></DifficultySelector>
      <custom-button type="grey" @click="openSummon">Open</custom-button>
    </div>
  </div>
</template>

<script>
"use strict";

import RaidsMeta from "@/raids_meta.json";
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";
import DifficultySelector from "@/components/DifficultySelector.vue";

export default {
  props: ["raid", "pendingList"],
  components: { CustomButton, DifficultySelector },
  data() {
    return {
      stages: [],
      stageStates: []
    };
  },
  computed: {
    meta() {
      return RaidsMeta[this.raid];
    },
    enemyImage() {
      return UiConstants.backgroundImage(
        UiConstants.enemyImage(this.meta.icon)
      );
    }
  },
  activated() {
    // indicate which difficulty stage is available for summon for a quick overview
    this.stages.length = 0;
    this.meta.stages.forEach((bossStage, stage) => {
      this.stages.push(stage);
      this.stageStates.push(
        this.$game.crafting.hasEnoughResourcesForRecipe(bossStage.summonRecipe)
      );
    });
  },
  methods: {
    openSummon() {
      this.$router.push({ name: "summon-raid", params: { raid: this.raid } });
    }
  }
};
</script>

<style lang="less" scoped>
.raid-summon-element {
  width: 100%;
  height: 16rem;
  padding: 0 1rem 0 1rem;
}

.boss-image {
  flex: 1 1;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
</style>



