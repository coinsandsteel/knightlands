<template>
  <div class="screen-content" v-if="unit">
    <div class="color-panel-2 flex flex-center">
      <loot
        v-for="slot in equipmentSlots"
        :key="slot"
        class="margin-half"
        :selected="selectedSlot == slot"
        :equipment="true"
        :equipmentSlot="slot"
        @hint="handleSlotSelection(slot)"
      ></loot>
    </div>

    <LootContainer
      :items="filteredItems"
      :inventory="true"
      :selectedItem="equippedItem"
      @hint="handleHint"
    ></LootContainer>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";
import LootContainer from "@/components/LootContainer.vue";
import { EquipmentSlots } from "@/../knightlands-shared/equipment_slot";

export default {
  props: ["unit"],
  mixins: [HintHandler],
  components: { Loot, LootContainer },
  data: () => ({
    equippedItem: 0,
    selectedSlot: -1,
    filteredItems: []
  }),
  computed: {
    equipmentSlots() {
      let slots = [];
      if (this.unit.troop) {
        slots.push(EquipmentSlots.MainHand);
        slots.push(EquipmentSlots.OffHand);
      } else {
        slots.push(EquipmentSlots.Helmet);
        slots.push(EquipmentSlots.Chest);
        slots.push(EquipmentSlots.Gloves);
        slots.push(EquipmentSlots.Cape);
        slots.push(EquipmentSlots.Boots);
      }
      return slots;
    }
  },
  methods: {
    handleSlotSelection(slot) {
      this.selectedSlot = slot;
      this.filteredItems = this.$game.inventory.filterItemsByType(
        { [slot]: true },
        this.filteredItems
      );
    }
  }
};
</script>
