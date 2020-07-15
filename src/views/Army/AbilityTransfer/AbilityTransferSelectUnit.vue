<template>
  <div class="screen-content">
    <div class="element-background" :class="element"></div>
    <UnitView :unit="unit" :showSelect="true" @select="handleUnitSelect" />
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" v-show="!hideTabs" />

    <div class="flex-full relative dummy-height">
      <UnitInventory
        ref="inventory"
        :units="filteredUnits"
        :selectedUnit="unit"
        @unitSelect="selectUnit"
      />
    </div>

    <portal to="footer">
      <CustomButton type="grey" @click="showUnitFilters">{{ $t("btn-filters") }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitInventory from "../UnitInventory.vue";
import Tabs from "@/components/Tabs.vue";
import UnitView from "../UnitView.vue";
import CustomButton from "@/components/Button.vue";

import DoubleBuffer from "@/helpers/DoubleBuffer";
import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ItemFilter = CreateDialog(ItemFilterComponent);

const Troops = "troops";
const Generals = "generals";

export default {
  mixins: [AppSection],
  props: ["from", "excludeUnit"],
  components: { UnitInventory, Tabs, UnitView, CustomButton },
  created() {
    this.title = "window-select-unit";
    this.$options.useRouterBack = true;
    this.filteredUnitsBuffer = new DoubleBuffer();
    this.filtersStore = this.$store.getters.getUnitFilters;
  },
  mounted() {
    this.filterUnits();
  },
  watch: {
    excludeUnit() {
      this.unit = null;
      this.$refs.inventory.resetSelection();
      this.filterUnits();
    }
  },
  data: () => ({
    unit: null,
    filteredUnits: [],
    tabs: [
      { title: Troops, value: Troops },
      {
        title: Generals,
        value: Generals
      }
    ],
    currentTab: Troops
  }),
  computed: {
    hideTabs() {
      return !!this.excludeUnit;
    },
    element() {
      if (this.unit) {
        return this.$game.armyDB.getElement(this.unit);
      }

      return null;
    }
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
      this.filterUnits();
    },
    selectUnit(unit) {
      this.unit = unit;
    },
    handleUnitSelect(unit) {
      if (this.from) {
        this.$emit("selectFrom", unit);
      } else {
        this.$emit("selectTo", unit);
      }

      this.$router.back();
    },
    async showUnitFilters() {
      const filters = await ItemFilter({
        stateFilters: this.filtersStore,
        commitCmd: "setUnitFilters",
        filterLocalisation: "unit-s-filter"
      });

      if (filters) {
        this.filterUnits();
      }
    },
    filterUnits() {
      this.filteredUnits = this.$game.army.getUnitsWithFilter(
        this.currentTab == Troops,
        x => {
          return (
            (!this.excludeUnit &&
              this.filtersStore[this.$game.armyDB.getStars(x)]) ||
            (x.template == this.excludeUnit.template &&
              x.id != this.excludeUnit.id)
          );
        }
      );

      if (this.filteredUnits.length > 0) {
        this.$refs.inventory.toggleSlot(this.filteredUnits[0]);
      }
    }
  }
};
</script>
