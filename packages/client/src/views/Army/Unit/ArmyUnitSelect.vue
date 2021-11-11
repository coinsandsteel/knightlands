<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <UnitView :unit="unit" :units="filteredUnits()" />
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

    <div class="flex-full relative dummy-height">
      <UnitInventory
        ref="inventory"
        :unit="unit"
        :units="units"
        :selectedUnit="unit"
        @unitSelect="selectUnit"
      />
    </div>

    <!-- <portal to="footer" v-if="isActive">
      <CustomButton type="green" @click="editUnit">{{
        $t("btn-select")
      }}</CustomButton>
    </portal> -->
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitInventory from "../UnitInventory.vue";
import Tabs from "@/components/Tabs.vue";
import UnitView from "../UnitView.vue";

const Troops = "troops";
const Generals = "generals";

export default {
  mixins: [AppSection],
  components: { UnitInventory, Tabs, UnitView },
  created() {
    this.title = "w-select-unit";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    unit: null,
    units: [],
    tabs: [
      { title: Troops, value: Troops },
      {
        title: Generals,
        value: Generals
      }
    ],
    currentTab: Troops
  }),
  mounted() {
    this.switchTab(this.currentTab);
  },
  computed: {
    element() {
      if (this.unit) {
        return this.$game.armyDB.getElement(this.unit);
      }

      return null;
    }
  },
  methods: {
    filteredUnits() {
      if (!this.$refs.inventory) {
        return [];
      }
      return this.$refs.inventory.getUnits();
    },
    switchTab(newTab) {
      this.currentTab = newTab;
      this.units = this.$game.army.getUnits(this.currentTab == Troops);
    },
    selectUnit(unit) {
      this.unit = unit;
    },
    editUnit() {
      this.$router.push({
        name: "unit-level",
        params: { unitId: this.unit.id }
      });
    }
  }
};
</script>
