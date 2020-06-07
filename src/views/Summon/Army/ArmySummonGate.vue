<template>
  <div class="screen-content" @click="continuePreview">
    <template v-if="!showResults">
      <UnitPreview :unit="previewedUnit" />
    </template>
    <template v-else>
      <ArmySummonResults :units="computedUnits"></ArmySummonResults>
    </template>

    <portal to="footer">
      <div class="flex flex-center width-100 height-100">
        <span class="font-size-20 uppercase font-weight-900">TAP TO CONTINUE</span>
      </div>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import UnitPreview from "./UnitPreview.vue";
import ArmySummonResults from "./ArmySummonResults.vue";

let mock = [
  {
    troop: true,
    template: 1,
    promotions: 0,
    id: 1,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 10,
    promotions: 0,
    id: 2,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 74,
    promotions: 0,
    id: 3,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 187,
    promotions: 0,
    id: 6,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 17,
    promotions: 0,
    id: 7,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 24,
    promotions: 0,
    id: 8,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 69,
    promotions: 0,
    id: 12,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 136,
    promotions: 0,
    id: 13,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 92,
    promotions: 0,
    id: 14,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  },
  {
    troop: true,
    template: 18,
    promotions: 0,
    id: 15,
    level: 1,
    abilities: [2741, 2749, 2754, 2753]
  }
];

export default {
  mixins: [AppSection],
  props: ["units", "type"],
  components: { UnitPreview, ArmySummonResults },
  data: () => ({
    currentPreviewIndex: 0
  }),
  activated() {
    this.currentPreviewIndex = 0;
  },
  computed: {
    computedUnits() {
      return this.units || mock;
    },
    previewedUnit() {
      if (this.showResults) {
        return;
      }
      return this.computedUnits[this.currentPreviewIndex];
    },
    showResults() {
      return this.computedUnits.length <= this.currentPreviewIndex;
    }
  },
  methods: {
    continuePreview() {
      if (!this.showResults) {
        this.currentPreviewIndex++;
      } else {
        this.$router.back();
      }
    }
  }
};
</script>
