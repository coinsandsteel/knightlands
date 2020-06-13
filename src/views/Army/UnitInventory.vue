<template>
  <div v-bar>
    <div class="flex-full dummy-height">
      <div class="padding-half">
        <div class="width-100 flex">
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
  props: ["units", "multiSelect", "selectedUnit"],
  components: { UnitItem },
  data: () => ({
    selectedSlots: {}
  }),
  methods: {
    toggleSlot(unit) {
      if (this.selectedSlots[unit.id]) {
        this.$delete(this.selectedSlots, unit.id);
        this.$emit("toggle", unit.id, false);
        return;
      }

      if (!this.multiSelect) {
        this.$emit("unitSelect", unit);
        return;
      }

      this.$set(this.selectedSlots, unit.id, true);
      this.$emit("toggle", unit.id, true);
    }
  }
};
</script>

<style lang="less" scoped>
.unit-items {
  float: left;
}
</style>
