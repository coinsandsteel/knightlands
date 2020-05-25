<template>
  <div class="screen-content">
    <div class="element-background" :class="element"></div>
    <UnitView :unit="unit" :showSelect="true" @select="editUnit" />
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

    <div class="flex-full relative dummy-height">
      <UnitInventory
        :isTroops="currentTab == Troops"
        :selectedUnit="unit"
        @unitSelect="selectUnit"
      />
    </div>
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
    this.title = "window-select-unit";
  },
  async mounted() {
    await this.$game.army.load();
  },
  data: () => ({
    unit: null,
    Troops,
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
    editUnit(unit) {
      this.$router.push({ name: "unit-level", params: { unitId: unit.id } });
    }
  }
};
</script>
