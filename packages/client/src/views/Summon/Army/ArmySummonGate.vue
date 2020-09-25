<template>
  <div class="screen-content" @click="continuePreview">
    <template v-if="!showResults">
      <UnitPreview :unit="previewedUnit" />
    </template>
    <template v-else>
      <ArmySummonResults :units="computedUnits"></ArmySummonResults>
    </template>

    <portal to="footer" v-if="isActive">
      <div class="flex flex-center width-100 height-100">
        <span class="font-size-20 uppercase font-weight-900">{{$t("continue_from_gacha")}}</span>
      </div>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import UnitPreview from "./UnitPreview.vue";
import ArmySummonResults from "./ArmySummonResults.vue";

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
