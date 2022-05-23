<template>
  <UserDialog @close="handleClose" emitClose title="select unit">
    <template v-slot:content>
      <BattleUnitList :units="units" />
    </template>
    <template v-slot:footer>
      <CustomButton
        type="yellow"
        :disabled="!isEnoughSelected"
        @click="handleClose"
        >{{ $t("btn-confirm") }}</CustomButton
      >
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";

export default {
  props: ["usedUnits"],
  components: { UserDialog, BattleUnitList },
  data: () => ({
    selectedUnits: []
  }),
  computed: {
    isEnoughSelected() {
      return true;
    },
    units() {
      const result = [];
      for (let i = 0; i < 42; i++) {
        result.push({
          id: i + 1
        });
      }

      return result;
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
        const idx = this.selectedUnits.findIndex(x => x.unitId === unit.unitId);
        this.selectedUnits.splice(idx, 1);
      }
    }
  }
};
</script>
