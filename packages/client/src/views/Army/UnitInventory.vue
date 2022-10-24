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
            v-for="(unit, idx) in filteredUnits"
            :id="`u-${idx}`"
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

      <div class="flex flex-center">
        <span class="font-size-20 flex-o-99 n">{{
          $t("unit-slots", { c: currentSlots, t: maxSlots })
        }}</span>
        <span
          v-if="notAtMaxSlots"
          class="item-icon button_plus_footer margin-left-half pointer"
          @click="expandArmy"
        ></span>
      </div>
    </portal>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import UnitItem from "./UnitItem.vue";
import DoubleBuffer from "@/helpers/DoubleBuffer";
import ActivityMixin from "@/components/ActivityMixin.vue";
import ArmyMeta from "@/metadata/army_meta.json";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

import { create as CreateDialog } from "vue-modal-dialogs";

import UnitFilter from "./UnitFilter.vue";
const ShowUnitFilter = CreateDialog(UnitFilter);

import PurchaseArmySlots from "@/views/Summon/Army/PurchaseArmySlots.vue";
const ShowPurchaseArmySlots = CreateDialog(PurchaseArmySlots);

export default {
  props: {
    units: Array,
    multiSelect: Boolean,
    selectedUnit: Object,
    remove: Boolean,
    disableSelect: Boolean,
    unit: Object,
    autoselect: {
      type: Boolean,
      default: true
    }
  },
  components: { UnitItem, CustomButton },
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
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
  computed: {
    notAtMaxSlots() {
      return this.maxSlots < ArmyMeta.maxSlots;
    },
    currentSlots() {
      return this.$game.army.currentSlots;
    },
    maxSlots() {
      return this.$game.army.maxSlots;
    }
  },
  methods: {
    async expandArmy() {
      await ShowPurchaseArmySlots();
    },
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
      await ShowUnitFilter({
        filter: this.filtersStore,
        commitCmd: "setUnitFilters",
        filterChangedCb: this.filterUnits.bind(this)
      });
    },
    filterUnits() {
      this.filteredUnits = this.$game.army.filterProvidedUnits(
        this.units,
        this.filtersStore,
        this.filteredUnitsBuffer.get(),
        this.unit
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
