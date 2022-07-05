<template>
  <div class="padding-2">
    <div class="font-size-22">
      <p>Pwr: {{ power }}</p>
      <p v-if="bonuses">Bonuses: <br />{{ bonuses }}</p>
    </div>
    <BattleUnitList
      :units="units"
      :isClearButtonVisible="true"
      @click="clickHandler"
      @clear="clearHandler"
    />
    <CustomButton
      v-if="units.length < 5"
      type="green"
      class="inline-block"
      width="8rem"
      @click="updateUnitHandler(units.length)"
      >{{ $t("add") }}</CustomButton
    >
    <portal to="footer" :slim="true" v-if="isActive">
      <CustomButton type="blue" @click="buildSquad">Build squad</CustomButton>
    </portal>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import { mapState } from "vuex";
// import BattleUnit from "@/views/Battle/BattleUnit.vue";
// import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
// import AppSection from "@/AppSection.vue";
// import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";

export default {
  mixins: [ActivityMixin],
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
      const result =
        this.game && this.game.userSquad && this.game.userSquad.units
          ? this.game.userSquad.units
          : [];

      const length = result.length;

      for (let i = 0; i < 5 - length; i++) {
        result.push(null);
      }

      return result;
    },
    power() {
      return this.game && this.game.userSquad ? this.game.userSquad.power : 0;
    },
    bonuses() {
      const bonusItems =
        this.game && this.game.userSquad
          ? this.game.userSquad.bonuses || []
          : [];

      if (!bonusItems.length > 0) {
        return null;
      }
      return bonusItems;
    }
  },
  methods: {
    buildSquad() {
      this.$store.dispatch("battle/testAction", {
        action: "buildSquad"
      });
    },
    async clickHandler({ unit, index }) {
      if (!unit) {
        this.updateUnitHandler(index);
        return;
      }
      const unitIndex = this.units.findIndex(
        ({ unitId }) => unit.unitId === unitId
      );
      if (!(unitIndex > -1)) {
        return;
      }

      this.updateUnitHandler(unitIndex);
    },
    async clearHandler({ unit, index }) {
      this.$store.dispatch("battle/clearSquadSlot", {
        unitId: unit.unitId,
        index
      });
    },
    async updateUnitHandler(index) {
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
