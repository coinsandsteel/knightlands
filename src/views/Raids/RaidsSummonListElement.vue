<template>
  <div class="flex flex-column flex-no-wrap raid-summon-element color-panel-2">
    <Title titleClass="font-weight-700 enemy-title-font">{{$t(meta.name)}}</Title>
    <div class="flex full-flex">
      <div class="flex-basis-50 boss-image" :style="enemyImage">
      <!-- <div class="title font-size-20 enemy-title-font">{{$t(meta.name)}}</div> -->
      <!-- <div class="pixelated boss-image" :style="enemyImage"></div> -->
    </div>
    <div class="flex-basis-50 flex flex-column flex-center full-flex flex-space-around">
      <custom-button type="grey" @click="openSummon">{{$t("btn-summon-raid")}}</custom-button>
    </div>
    </div>
  </div>
</template>

<script>
"use strict";

import RaidsMeta from "@/raids_meta.json";
import UiConstants from "@/ui_constants";
import CustomButton from "@/components/Button.vue";
import Campaign from "@/campaign_database";
import Title from "@/components/Title.vue";

export default {
  props: ["raid", "pendingList"],
  components: { CustomButton, Title },
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
        Campaign.getRaidImage(this.raid)
      );
    }
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
  height: 24rem;
}

.boss-image {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
</style>



