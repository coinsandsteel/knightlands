<template>
  <div
    class="flex flex-column flex-space-between flex-start width-100 margin-bottom-1 bg"
    :style="background"
    :class="[`rarity-${trial.rarity}`]"
  >
    <span
      class="trial-title padding-1 font-outline text-align-right padding-right-3 font-weight-700"
      >{{ $t(trial.rarity) }}</span
    >
    <div class="flex flex-end margin-1">
      <CustomButton v-on="$listeners" :locked="locked" minWidth="15rem">{{
        $t("btn-enter")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import TrialBackground from "./trialBackgrounds";

export default {
  props: ["trialType", "index", "trial"],
  components: { CustomButton },
  computed: {
    locked() {
      return !this.$game.getTrialState(this.trialType).unlockedTrials[
        this.trial.id
      ];
    },
    background() {
      return {
        "background-image": `url(${TrialBackground.getBackground(
          this.trialType,
          this.index
        )})`
      };
    }
  }
};
</script>

<style lang="less" scoped>
.bg {
  background-position: center 25%;
  background-size: cover;
  background-repeat: no-repeat;
  height: 30rem;
}
</style>
