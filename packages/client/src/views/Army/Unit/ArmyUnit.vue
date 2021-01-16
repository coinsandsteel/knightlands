<template>
  <div class="screen-content">
    <div class="screen-background" :class="element"></div>
    <UnitView
      :unit="computedUnit"
      :showEquipment="false"
      :showNavigation="hasUnits"
      @next="goToNext"
      @prev="goToPrev"
    />
    <Tabs
      :replace="true"
      :router="true"
      :tabs="tabs"
      :currentTab="currentTab"
    />
    <keep-alive v-if="computedUnit">
      <router-view :unit="computedUnit" :units="units"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitGetterMixin from "../UnitGetterMixin.vue";
import UnitView from "../UnitView.vue";
import Tabs from "@/components/Tabs.vue";

export default {
  mixins: [AppSection, UnitGetterMixin],
  props: ["unitId", "units"],
  components: { Tabs, UnitView },
  created() {
    this.title = "window-edit-unit";
    this.$options.useRouterBack = true;
  },
  mounted() {
    this.unit = this.$game.army.getUnit(this.unitId);

    if (this.units) {
      let idx = 0;
      for (const unit of this.units) {
        if (unit.id == this.unit.id) {
          this.unitIdx = idx;
          break;
        }

        idx++;
      }
    }

    this.tabs = [
      {
        title: "level-up",
        to: { name: "unit-level", params: { units: this.units } }
      },
      {
        title: "equipment",
        to: { name: "unit-equip", params: { units: this.units } }
      },
      {
        title: "promotion",
        to: { name: "unit-promo", params: { units: this.units } }
      }
    ];
  },
  data: () => ({
    unitIdx: -1,
    unit: null,
    tabs: [],
    currentTab: "level-up"
  }),
  watch: {
    unitId() {
      this.unit = this.$game.army.getUnit(this.unitId);
    }
  },
  computed: {
    hasUnits() {
      return !!this.units;
    },
    computedUnit() {
      if (!this.hasUnits) {
        return this.unit;
      } else {
        return this.units[this.unitIdx];
      }
    }
  },
  methods: {
    goToNext() {
      if (!this.hasUnits) {
        return;
      }

      this.unitIdx++;
      if (this.unitIdx == this.units.length) {
        this.unitIdx = 0;
      }
    },
    goToPrev() {
      if (!this.hasUnits) {
        return;
      }

      this.unitIdx--;
      if (this.unitIdx < 0) {
        this.unitIdx = this.units.length - 1;
      }
    }
  }
};
</script>
