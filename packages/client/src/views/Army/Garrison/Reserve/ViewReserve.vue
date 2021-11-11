<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <UnitView
      :unit="filteredUnits[selectedUnitKey]"
      :garrison="true"
    ></UnitView>
    <div class="flex-full relative dummy-height" v-bar>
      <div class="flex-full">
        <div class="padding-half">
          <div class="width-100 flex">
            <ReserveUnit
              class="width-20 pointer"
              v-for="(unit, key) in filteredUnits"
              :key="key"
              :unit="unit"
              :selected="key == selectedUnitKey"
              @click="handleUnitSelect(key)"
            />
          </div>
        </div>
      </div>
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton type="grey" @click="showUnitFilters">{{
        $t("btn-filter")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ReserveUnit from "./ReserveUnit.vue";
import UnitView from "../../UnitView.vue";
import DoubleBuffer from "@/helpers/DoubleBuffer";
import CustomButton from "@/components/Button.vue";

import { create as CreateDialog } from "vue-modal-dialogs";

import UnitFilter from "./../../UnitFilter.vue";
const ShowUnitFilter = CreateDialog(UnitFilter);

export default {
  mixins: [AppSection],
  components: { ReserveUnit, UnitView, CustomButton },
  created() {
    this.title = "window-garrison";
    this.$options.useRouterBack = true;
    this.filteredUnitsBuffer = new DoubleBuffer();
    this.filtersStore = this.$store.getters.getUnitFilters;
  },
  data: () => ({
    selectedUnitKey: null,
    filteredUnits: []
  }),
  mounted() {
    this.filterUnits();
  },
  methods: {
    handleUnitSelect(unitKey) {
      this.selectedUnitKey = unitKey;
    },
    async showUnitFilters() {
      await ShowUnitFilter({
        filter: this.filtersStore,
        commitCmd: "setUnitFilters",
        filterChangedCb: this.filterUnits.bind(this)
      });
    },
    filterUnits() {
      this.filteredUnits = this.$game.army.filterProvidedUnits(
        this.$game.army.getReserve(),
        this.filtersStore,
        this.filteredUnitsBuffer.get()
      );
    }
  }
};
</script>
