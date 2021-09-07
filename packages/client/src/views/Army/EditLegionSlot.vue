<template>
  <div class="screen-content">
    <UnitView :unit="unit" :showEquipment="true" :units="filteredUnits()" />
    <div class="flex-full relative dummy-height">
      <div class="element-background" :class="element"></div>
      <UnitInventory
        ref="inventory"
        :remove="true"
        :unit="unit"
        :units="units"
        @removed="handleUnitRemove"
        :autoselect="false"
        :selectedUnit="unit"
        @unitSelect="selectUnit"
      />
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton
        type="green"
        @click="saveAndExit(true)"
        :disabled="!canConfirm"
        id="confirm"
        >{{ $t("btn-confirm") }}</CustomButton
      >
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitView from "./UnitView.vue";
import UnitInventory from "./UnitInventory.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CustomButton from "@/components/Button.vue";

const NO_UNIT = null;

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  props: ["legion", "slotId", "type"],
  components: {
    UnitView,
    UnitInventory,
    CustomButton
  },
  data: () => ({
    units: [],
    tempSlots: {
      deadbeef: 1
    }
  }),
  created() {
    this.$options.useRouterBack = true;
    this.title = "w-edit-leg";
  },
  watch: {
    legion: {
      immediate: true,
      handler() {
        this.load();
      }
    },
    slotId: {
      immediate: true,
      handler() {
        this.load();
      }
    },
    type: {
      immediate: true,
      handler() {
        this.load();
      }
    }
  },
  computed: {
    element() {
      if (this.unit && this.unit != NO_UNIT) {
        return this.$game.armyDB.getElement(this.unit);
      }

      return null;
    },
    isTroops() {
      return this.type == "troops";
    },
    canConfirm() {
      return this.unit != this.originalUnit;
    },
    originalUnit() {
      let slots = this.$game.army.getSlots(this.legion, this.isTroops);

      let foundSlot = slots.find(s => s.id == this.slotId);
      if (!foundSlot) {
        slots = this.$game.army.getSlots(this.legion, !this.isTroops);
        foundSlot = slots.find(s => s.id == this.slotId);
      }

      return foundSlot.unit;
    },
    unit() {
      return this.tempSlots[this.slotId];
    }
  },
  methods: {
    filteredUnits() {
      if (!this.$refs.inventory) {
        return [];
      }
      return this.$refs.inventory.getUnits();
    },
    load() {
      this.tempSlots = this.$game.army.tempSlots;

      const legion = this.$game.army.getLegion(this.legion);
      const exceptUnits = {};
      const exceptTemplates = {};
      for (const slotId in legion.units) {
        const unitId = legion.units[slotId];

        if (!this.originalUnit || unitId != this.originalUnit.id) {
          exceptUnits[unitId] = true;

          const unit = this.$game.army.getUnit(unitId);
          if (!unit) {
            continue;
          }
          const template = unit.template;
          if (!this.originalUnit || template != this.originalUnit.template) {
            exceptTemplates[template] = true;
          }
        }
      }

      this.units = this.$game.army.getUnitsWithFilter(this.isTroops, x => {
        const isOriginal = this.originalUnit
          ? x.id == this.originalUnit.id
          : false;
        return (
          (isOriginal || x.legion == -1) &&
          !exceptUnits[x.id] &&
          !exceptTemplates[x.template]
        );
      });

      this.selectUnit(this.originalUnit);
    },
    selectUnit(unit) {
      // set as active unit in slot
      this.$game.army.setTempSlot(this.slotId, unit);
    },
    handleUnitRemove() {
      this.$game.army.setTempSlot(this.slotId, NO_UNIT);
    },
    handleBackButton() {
      if (this.canConfirm) {
        this.saveAndExit();
        return true;
      }

      this.$router.back();
      return true;
    },
    async saveAndExit(skipConfirmation) {
      let confirmation = true;
      if (!skipConfirmation) {
        confirmation = await this.showPrompt(
          this.$t("legion-slot-change-title"),
          this.$t("legion-slot-change-desc"),
          [
            {
              type: "red",
              title: this.$t("btn-cancel"),
              response: false
            },
            {
              type: "green",
              title: this.$t("btn-ok"),
              response: true
            }
          ]
        );
      }

      if (confirmation) {
        let unitId = 0;
        if (this.unit && this.unit != NO_UNIT) {
          unitId = this.unit.id;
        }

        await this.performRequest(
          this.$game.setLegionSlot(this.legion, this.slotId, unitId)
        );
        this.$game.army.setInSlot(
          this.legion,
          this.slotId,
          unitId == 0 ? null : this.unit
        );
      }

      this.load();
      this.$app.handleBackButton();
    }
  }
};
</script>
