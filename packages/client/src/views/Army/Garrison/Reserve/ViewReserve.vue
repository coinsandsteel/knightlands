<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <UnitView
      :unit="garrisonUnits[selectedUnitKey]"
      :garrison="true"
    ></UnitView>
    <div class="height-100" v-bar>
      <div class="flex-full">
        <div class="padding-half">
          <div class="width-100 flex">
            <ReserveUnit
              class="width-20"
              v-for="(unit, key) in garrisonUnits"
              :key="key"
              :unit="unit"
              :selected="selectedUnitKey && key == selectedUnitKey"
              @click="handleUnitSelect(key)"
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
import UnitView from "../../UnitView.vue";

export default {
  mixins: [AppSection],
  components: { ReserveUnit, UnitView },
  created() {
    this.title = "window-garrison";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    selectedUnitKey: null
  }),
  computed: {
    garrisonUnits() {
      return this.$game.army.getReserve();
    }
  },
  methods: {
    handleUnitSelect(unitKey) {
      this.selectedUnitKey = unitKey;
    }
  }
};
</script>
