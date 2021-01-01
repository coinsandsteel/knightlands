<template>
  <div class="flex flex-column flex-no-wrap raid-summon-element">
    <Title
      :stackTop="true"
      :stackBottom="true"
      titleClass="font-weight-700 enemy-title-font"
      >{{ $t(raidName) }} {{ $t("unit-lvl", { lvl: raidLevel }) }}</Title
    >
    <div
      class="flex full-flex color-panel-1"
      :class="{ 'color-panel-2': index % 2 }"
    >
      <div class="flex-basis-50 boss-image" :style="raidImage" />
      <div
        class="flex-basis-50 flex flex-column flex-items-center flex-end full-flex"
      >
        <!-- <div v-if="$game.load" class="margin-bottom-1">
          <div class="flex flex-center margin-top-1">
            <crafting-ingridient
              v-for="essence in requiredEssences"
              :key="essence.itemId"
              :ingridient="essence"
            />
          </div>
        </div> -->
        <span
          v-if="!levelRequirementMet"
          class="font-error font-size-22 font-weight-900 margin-bottom-3"
          >{{ $t("no-raid-level", { level: raidLevel }) }}</span
        >
        <custom-button type="yellow" @click="openSummon">{{
          $t("btn-summon-raid")
        }}</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
"use strict";

import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import RaidGetterMixin from "./RaidGetterMixin.vue";

export default {
  props: ["raid", "pendingList", "index"],
  mixins: [RaidGetterMixin],
  components: { CustomButton, Title },
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
