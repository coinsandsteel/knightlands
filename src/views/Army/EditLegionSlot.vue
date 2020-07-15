<template>
  <Promised :promised="request" class="screen-content">
    <template v-slot:combined="{isPending, isDelayOver }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>
      <UnitView :unit="unit" :showEquipment="true" />
      <div class="flex-full relative dummy-height">
        <div class="element-background" :class="element"></div>
        <UnitInventory
          :remove="true"
          :units="units"
          @removed="handleUnitRemove"
          :selectedUnit="unit"
          @unitSelect="selectUnit"
        />
      </div>
    </template>

    <portal to="footer" v-if="isActive"></portal>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection";
import UnitView from "./UnitView.vue";
import UnitInventory from "./UnitInventory.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  props: ["legion", "slotId", "type"],
  components: { UnitView, UnitInventory, LoadingScreen, Promised },
  data: () => ({
    unit: null,
    request: null,
    units: []
  }),
  created() {
    this.$options.useRouterBack = true;
    this.title = "";
  },
  mounted() {
    this.originalUnit = this.unit;
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
      if (this.unit) {
        return this.$game.armyDB.getElement(this.unit);
      }

      return null;
    },
    isTroops() {
      return this.type == "troops";
    }
  },
  methods: {
    load() {
      const slots = this.$game.army.getSlots(this.legion, this.isTroops);
      this.unit = slots.find(s => s.id == this.slotId).unit;

      const legion = this.$game.army.getLegion(this.legion);
      const exceptUnits = {};
      for (const slotId in legion.units) {
        if (legion.units[slotId]) {
          exceptUnits[legion.units[slotId]] = true;
        }
      }
      this.units = this.$game.army.getUnitsWithFilter(
        this.isTroops,
        x => !exceptUnits[x.id]
      );
    },
    selectUnit(unit) {
      // set as active unit in slot
      this.$game.army.setInSlot(this.legion, this.slotId, unit);
      this.unit = unit;
    },
    handleUnitRemove() {
      this.$game.army.setInSlot(this.legion, this.slotId, null);
      this.unit = null;
    },
    handleBackButton() {
      if (this.unit != this.originalUnit) {
        this.saveAndExit();
        return true;
      }

      this.$router.back();
      return true;
    },
    async saveAndExit() {
      let confirmation = await this.showPrompt(
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

      if (confirmation === false) {
        this.$game.army.setInSlot(this.legion, this.slotId, this.originalUnit);
        this.unit = this.originalUnit;
      } else {
        this.request = this.$game.setLegionSlot(
          this.legion,
          this.slotId,
          this.unit ? this.unit.id : 0
        );
        await this.performRequest(this.request);
        this.originalUnit = this.unit;
      }

      this.$app.handleBackButton();
    }
  }
};
</script>
