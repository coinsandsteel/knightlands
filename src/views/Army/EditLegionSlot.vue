<template>
  <div class="screen-content">
    <UnitView :unit="unit" />
    <div class="flex-full relative">
      <div class="bg" :class="element"></div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitView from "./UnitView.vue";

export default {
  mixins: [AppSection],
  props: ["legion", "slotId", "type"],
  components: { UnitView },
  data: () => ({
    unit: null
  }),
  created() {
    this.title = "1";
  },
  async mounted() {
    await this.$game.army.load();
    this.load();
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
    }
  },
  methods: {
    load() {
      const slots = this.$game.army.getSlots(
        this.legion,
        this.type == "troops"
      );
      this.unit = slots[this.slotId].unit;
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

