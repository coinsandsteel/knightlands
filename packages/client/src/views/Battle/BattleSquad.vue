<template>
  <div>
    <div class="battle-unit-list">
      <!-- <BattleUnit
        v-for="unit in units"
        :key="unit.id"
        @click="unitClickHandler"
      /> -->
      <div class="font-size-22">{{ bonus }}</div>
      <BattleUnitList :units="units" @click="clickHandler" />
      <CustomButton
        v-if="units.length < 5"
        type="green"
        class="inline-block"
        width="8rem"
        @click="updateUnitHandler(units.length)"
        >{{ $t("add") }}</CustomButton
      >
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import { mapState } from "vuex";
// import BattleUnit from "@/views/Battle/BattleUnit.vue";
// import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    // BattleUnit,
    BattleUnitList
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game"]),
    units() {
      // return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      return this.game && this.game.userSquad && this.game.userSquad.units
        ? this.game.userSquad.units
        : [];
    },
    bonus() {
      return "Attack + 1, defense + 1";
    }
  },
  methods: {
    async clickHandler(unit) {
      console.log("clickHandler");
      const index = this.units.findIndex(({ id }) => unit.id === id);
      if (!(index > -1)) {
        return;
      }

      this.updateUnitHandler(index);
    },
    async updateUnitHandler(index) {
      console.log("addUnitHandler");
      this.$router.push({
        name: "battle-units",
        params: {
          slot: "squad",
          index
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
// .battle-unit-list {
//   display: grid;
//   grid-template-columns: repeat(5, minmax(10rem, 1fr));
//   justify-items: center;
//   row-gap: 0.5rem;
//   column-gap: 0.5rem;
// }
// .battle-unit {
//   width: 100%;
// }
</style>
