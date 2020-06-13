<template>
  <UserDialog @close="$close" title="promo-units">
    <template v-slot:content>
      <UnitInventory
        :units="units"
        v-if="units.length > 0"
        :multiSelect="!isEnoughSelected"
        @toggle="toggleUnitSelect"
      />
      <div class="flex flex-center min-height-10r" v-else>
        <span class="font-size-22">No suitable units</span>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton
        type="yellow"
        :disabled="!isEnoughSelected"
        @click="handleClose"
      >{{$t("btn-confirm")}}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import UnitInventory from "../UnitInventory.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["unit", "ingridient", "usedUnits"],
  components: { UserDialog, UnitInventory, CustomButton },
  data: () => ({
    selectedUnits: []
  }),
  computed: {
    isEnoughSelected() {
      return this.selectedUnits.length >= this.ingridient.amount;
    },
    units() {
        console.log(this.usedUnits)
      // filter units based on ingridient
      return this.$game.army.filterIngridientUnits(
        this.unit,
        this.ingridient,
        this.usedUnits
      );
    }
  },
  methods: {
    handleClose() {
      this.$close(this.selectedUnits);
    },
    toggleUnitSelect(unit, isSelected) {
      if (isSelected) {
        this.selectedUnits.push(unit);
      } else {
        const idx = this.selectedUnits.findIndex(x => x.id === unit.id);
        this.selectedUnits.splice(idx, 1);
      }
    }
  }
};
</script>
