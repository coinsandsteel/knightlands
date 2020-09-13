<template>
  <div class="screen-content">
    <UnitView :unit="unit" :showEquipment="false" />
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitView from "./UnitView.vue";

export default {
  mixins: [AppSection],
  props: ["unitId"],
  components: { UnitView },
  created() {
    this.title = "";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    unit: null
  }),
  watch: {
    unitId: {
      immediate: true,
      handler() {
        this.unit = this.$game.army.getUnit(this.unitId);
      }
    }
  }
};
</script>
