<template>
  <div class="screen-content">
    <UnitView :unit="unit" />
    <div class="flex-full relative">
      <div class="bg" :class="element"></div>
      <UnitInventory :isTroops="isTroops" :selectedUnit="unit" @unitSelect="selectUnit" />
    </div>

    <portal to="footer" v-if="isActive"></portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitView from "./UnitView.vue";
import UnitInventory from "./UnitInventory.vue";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [AppSection, PromptMixin],
  props: ["legion", "slotId", "type"],
  components: { UnitView, UnitInventory },
  data: () => ({
    unit: null
  }),
  created() {
    this.$options.useRouterBack = true;
    this.title = "";
  },
  async mounted() {
    await this.$game.army.load();
    this.load();
    this.originalUnit = this.unit;
  },
  watch: {
    legion() {
      this.load();
    },
    slotId() {
      this.load();
    },
    type() {
      this.load();
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
      this.unit = slots[this.slotId].unit;
    },
    selectUnit(unit) {
      // set as active unit in slot
      this.$game.army.setInSlot(this.legion, this.slotId, unit);
      this.unit = unit;
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

      if (confirmation === true) {
        
      }

      this.originalUnit = this.unit;
      this.$app.handleBackButton();
    }
  }
};
</script>

<style lang="less" scoped>
.bg {
  position: absolute !important;
  top: 0rem !important;
  left: 0 !important;
  right: 0 !important;
  bottom: -5rem !important;

  &.water {
    background: rgba(38, 123, 143, 1);
    background: linear-gradient(
      180deg,
      rgba(32, 15, 32, 1) 0%,
      rgba(38, 123, 143, 1) 100%
    );
  }

  &.earth {
    background: rgb(79, 43, 32, 1);
    background: linear-gradient(
      180deg,
      rgba(32, 15, 32, 1) 0%,
      rgba(79, 43, 32, 1) 100%
    );
  }
  &.darkness {
    background: rgb(108, 29, 143, 1);
    background: linear-gradient(
      180deg,
      rgba(32, 15, 32, 1) 0%,
      rgba(108, 29, 143, 1) 100%
    );
  }
  &.light {
    background: rgb(143, 104, 54, 1);
    background: linear-gradient(
      180deg,
      rgba(32, 15, 32, 1) 0%,
      rgba(143, 104, 54, 1) 100%
    );
  }
}
</style>

