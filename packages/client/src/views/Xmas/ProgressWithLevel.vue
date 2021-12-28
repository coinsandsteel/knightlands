<template>
  <div class="flex flex-center flex-no-wrap">
    <LevelLabel :level="level"></LevelLabel>
    <ProgressBar
      barClasses="no-animation"
      :maxValue="maxValue || 100"
      :percentMode="false"
      :hideMaxValue="false"
      v-model="value"
      barType="blue"
    ></ProgressBar>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import LevelLabel from "./LevelLabel.vue";

export default {
  components: {
    ProgressBar,
    LevelLabel
  },
  props: ["level", "value", "maxValue"]
};
</script>
