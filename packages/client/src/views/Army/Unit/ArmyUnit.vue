<template>
  <div class="screen-content">
    <div class="screen-background" :class="element"></div>
    <div v-bar>
      <div>
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
          <router-view
            :unit="computedUnit"
            :units="computedUnits"
          ></router-view>
        </keep-alive>
      </div>
    </div>
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
  data: () => ({
    unit: null,
    tabs: [],
    currentTab: "level-up"
  }),
  watch: {
    unitId: {
      immediate: true,
      handler() {
        this.unit = this.$game.army.getUnit(this.unitId);

        this.tabs = [
          {
            title: "level-up",
            to: {
              name: "unit-level",
              params: { unitId: this.unitId, units: this.computedUnits }
            }
          },
          {
            title: "equipment",
            to: {
              name: "unit-equip",
              params: { unitId: this.unitId, units: this.computedUnits }
            }
          },
          {
            title: "promotion",
            to: {
              name: "unit-promo",
              params: { unitId: this.unitId, units: this.computedUnits }
            }
          }
        ];
      }
    }
  },
  computed: {
    unitIdx() {
      let unitIdx = -1;
      if (this.computedUnits) {
        let idx = 0;
        for (const unit of this.computedUnits) {
          if (unit.id == this.unit.id) {
            unitIdx = idx;
            break;
          }

          idx++;
        }
      }

      return unitIdx;
    },
    computedUnits() {
      return this.units
        ? this.units
        : this.$game.army.getUnits(this.unit.troop);
    },
    hasUnits() {
      return !!this.computedUnits;
    },
    computedUnit() {
      if (!this.hasUnits) {
        return this.unit;
      } else {
        return this.computedUnits[this.unitIdx];
      }
    }
  },
  methods: {
    goToNext() {
      if (!this.hasUnits) {
        return;
      }

      this.unitIdx++;
      if (this.unitIdx == this.computedUnits.length) {
        this.unitIdx = 0;
      }
    },
    goToPrev() {
      if (!this.hasUnits) {
        return;
      }

      this.unitIdx--;
      if (this.unitIdx < 0) {
        this.unitIdx = this.computedUnits.length - 1;
      }
    }
  }
};
</script>
