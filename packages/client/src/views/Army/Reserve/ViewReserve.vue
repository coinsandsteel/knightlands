<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="height-100" v-bar>
      <div class="flex-full">
        <div class="padding-half">
          <div class="width-100 flex">
            <ReserveUnit
              class="width-20"
              v-for="unit in garrisonUnits"
              :key="unit.id"
              :unit="unit"
              :selected="selectedUnit && unit.id == selectedUnit.id"
              @click="handleUnitSelect"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ReserveUnit from "./ReserveUnit.vue";

export default {
  mixins: [AppSection],
  components: { ReserveUnit },
  created() {
    this.title = "window-garrison";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    selectedUnit: null
  }),
  computed: {
    garrisonUnits() {
      return this.$game.army.getUnits(true);
    }
  },
  methods: {
    handleUnitSelect(unit) {
      this.selectedUnit = unit;
    }
  }
};
</script>
