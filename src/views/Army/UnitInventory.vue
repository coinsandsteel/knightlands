<template>
  <div v-bar>
    <div class="flex-full dummy-height">
      <div class="padding-half">
        <div class="width-100 flex">
          <UnitItem class="width-20" v-if="remove" @click="handleRemove" :empty="false" />
          <UnitItem
            class="width-20"
            v-for="unit in units"
            :key="unit.id"
            :unit="unit"
            :active="unit == selectedUnit"
            :selected="selectedSlots[unit.id]"
            @click="toggleSlot(unit)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitItem from "./UnitItem.vue";

export default {
  props: ["units", "multiSelect", "selectedUnit", "remove"],
  components: { UnitItem },
  data: () => ({
    selectedSlots: {}
  }),
  methods: {
    resetSelection() {
      this.selectedSlots = {};
    },
    toggleSlot(unit) {
      if (this.multiSelect && this.selectedSlots[unit.id]) {
        this.$delete(this.selectedSlots, unit.id);
        this.$emit("toggle", unit, false);
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
    }
  }
};
</script>

<style lang="less" scoped>
.unit-items {
  float: left;
}
</style>
