<template>
  <div class="flex flex-items-center flex-start">
    <div class="screen-background"></div>
    <div
      class="trials-bg width-100 flex flex-column flex-end flex-items-end flex-space-between margin-bottom-1"
      v-for="(trial, index) in trials"
      :key="index"
      :style="background(trial)"
      :class="`color-${trial}`"
    >
      <span
        class="trial-title text-align-right font-outline padding-1 font-weight-700"
        >{{ $t(`window-trials-${trial}`) }}</span
      >
      <div class="flex margin-1">
        <CustomButton minWidth="15rem" type="red" @click="goTo(trial)"
          >{{ $t("btn-enter") }}
          <TrialsMarker class="marker-pos" :trialType="trial" />
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import TrialType from "@/../../knightlands-shared/trial_type";
import TrialBackgrounds from "./trialBackgrounds";
import TrialsMarker from "@/components/Markers/Home/TrialsMarker.vue";

const trials = [TrialType.Armour, TrialType.Weapon, TrialType.Accessory];

export default {
  mixins: [AppSection],
  components: { CustomButton, TrialsMarker },
  data: () => ({
    trials
  }),
  created() {
    this.title = "window-trials";
  },
  methods: {
    goTo(trialType) {
      let name;

      switch (trialType) {
        case TrialType.Armour:
          name = "trials-of-honor";
          break;

        case TrialType.Weapon:
          name = "conjured-trials";
          break;

        case TrialType.Accessory:
          name = "trials-of-decay";
          break;
      }

      this.$router.push({ name });
    },
    background(trialType) {
      return {
        "background-image": `url(${TrialBackgrounds.getBackground(
          trialType,
          3
        )})`
      };
    }
  }
};
</script>

<style lang="less">
@import "./style.less";
</style>

<style lang="less" scoped>
.marker-pos {
  position: absolute;
  right: 0;
  top: 0;
}

.trials-bg {
  height: 20vh;
  background-size: cover;
  background-position: center;
}

.color-armour {
  color: #bdb8ff;
}

.color-weapon {
  color: #ffe0a7;
}

.color-accessory {
  color: #6adafc;
}
</style>
