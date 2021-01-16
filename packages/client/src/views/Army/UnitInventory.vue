<template>
  <div class="height-100" v-bar>
    <div class="flex-full">
      <div class="padding-half">
        <div class="width-100 flex">
          <UnitItem
            class="width-20"
            v-if="remove"
            @click="handleRemove"
            :empty="false"
          />
          <UnitItem
            class="width-20"
            v-for="unit in filteredUnits"
            :key="unit.id"
            :unit="unit"
            :selected="selectedSlots[unit.id]"
            @click="toggleSlot(unit)"
          />
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
import CustomButton from "@/components/Button.vue";
import UnitItem from "./UnitItem.vue";
import DoubleBuffer from "@/helpers/DoubleBuffer";
import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
const ItemFilter = CreateDialog(ItemFilterComponent);
import ActivityMixin from "@/components/ActivityMixin.vue";

export default {
  props: {
    units: Array,
    multiSelect: Boolean,
    selectedUnit: Object,
    remove: Boolean,
    disableSelect: Boolean,
    autoselect: {
      type: Boolean,
      default: true
    }
  },
  components: { UnitItem, CustomButton },
  mixins: [ActivityMixin],
  data: () => ({
    selectedSlots: {},
    filteredUnits: []
  }),
  created() {
    this.filteredUnitsBuffer = new DoubleBuffer();
    this.filtersStore = this.$store.getters.getUnitFilters;
    this.filterUnits();
  },
  watch: {
    units() {
      this.filterUnits();
    },
    selectedUnit: {
      immediate: true,
      handler() {
        this.toggleSlot(this.selectedUnit);
      }
    }
  },
  methods: {
    getUnits() {
      return this.filteredUnits;
    },
    resetSelection() {
      this.selectedSlots = {};
    },
    toggleSlot(unit) {
      if (!unit) {
        return;
      }

      if (this.multiSelect && this.selectedSlots[unit.id]) {
        this.$delete(this.selectedSlots, unit.id);
        this.$emit("toggle", unit, false);
        return;
      }

      if (this.disableSelect) {
        return;
      }

      if (!this.multiSelect) {
        this.selectedSlots = {
          [unit.id]: true
        };
        this.$emit("unitSelect", unit);
        return;
      }

      this.$set(this.selectedSlots, unit.id, true);
      this.$emit("toggle", unit, true);
    },
    handleRemove() {
      this.selectedSlots = {};
      this.$emit("removed");
    },
    async showUnitFilters() {
      await ItemFilter({
        stateFilters: this.filtersStore,
        commitCmd: "setUnitFilters",
        filterLocalisation: "unit-s-filter",
        filterChangedCb: this.filterUnits.bind(this)
      });

      // if (filters) {
      //   this.filterUnits();
      // }
    },
    filterUnits() {
      this.filteredUnits = this.$game.army.filterProvidedUnits(
        this.units,
        this.filtersStore,
        this.filteredUnitsBuffer.get()
      );

      if (this.autoselect) {
        if (!this.selectedUnit && this.filteredUnits.length > 0) {
          this.toggleSlot(this.filteredUnits[0]);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.unit-items {
  float: left;
}
</style>
