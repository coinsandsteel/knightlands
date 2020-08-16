<template>
  <div class="screen-content">
    <div class="element-background" :class="element"></div>
    <UnitView :unit="unit" />
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" v-show="!hideTabs" />

    <div class="flex-full relative dummy-height">
      <UnitInventory
        ref="inventory"
        :units="units"
        :selectedUnit="unit"
        @unitSelect="selectUnit"
      />
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton type="yellow" @click="handleUnitSelect">{{ $t("btn-select") }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitInventory from "../UnitInventory.vue";
import Tabs from "@/components/Tabs.vue";
import UnitView from "../UnitView.vue";
import CustomButton from "@/components/Button.vue";

const Troops = "troops";
const Generals = "generals";

export default {
  mixins: [AppSection],
  props: ["from", "excludeUnit"],
  components: { UnitInventory, Tabs, UnitView, CustomButton },
  created() {
    this.title = "window-select-unit";
    this.$options.useRouterBack = true;
    this.filtersStore = this.$store.getters.getUnitFilters;
  },
  watch: {
    excludeUnit() {
      this.unit = null;
      this.$refs.inventory.resetSelection();
    }
  },
  data: () => ({
    unit: null,
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
    units() {
      return this.$game.army.getUnits(this.currentTab == Troops);
    },
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
    },
    selectUnit(unit) {
      this.unit = unit;
    },
    handleUnitSelect() {
      if (this.from) {
        this.$emit("selectFrom", this.unit);
      } else {
        this.$emit("selectTo", this.unit);
      }

      this.$router.back();
    }
  }
};
</script>
