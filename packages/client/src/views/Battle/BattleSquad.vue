<template>
  <div class="padding-2">
    <div class="font-size-22 text-align-center">
      <div v-if="power">Power: {{ power }}</div>
      <div v-if="bonuses && bonuses.length > 0" class="margin-top-1">
        Bonuses: {{ bonuses }}
      </div>
      <!-- <div>
        <div
          v-for="(bonus, index) in bonuses"
          :key="index"
          class="font-size-20"
          v-html="bonus"
        ></div>
      </div> -->
    </div>
    <BattleUnitList
      :units="fighters"
      :isClearButtonVisible="true"
      @click="clickHandler"
      @clear="clearHandler"
    />
    <CustomButton
      v-if="fighters.length < 5"
      type="green"
      class="inline-block"
      width="8rem"
      @click="updateUnitHandler(fighters.length)"
      >{{ $t("add") }}</CustomButton
    >
    <portal to="footer" :slim="true" v-if="isActive">
      <CustomButton type="blue" @click="buildSquad">Build squad</CustomButton>
      <CustomButton type="red" @click="maxSquad">Maximize</CustomButton>
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
    fighters() {
      // return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const result =
        this.game && this.game.userSquad && this.game.userSquad.fighters
          ? this.game.userSquad.fighters
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
      const bonusItems = (this.game && this.game.userSquad
        ? this.game.userSquad.bonuses || []
        : []
      ).filter(({ type }) => type);

      if (!bonusItems.length > 0) {
        return null;
      }
      return bonusItems
        .map(bonus => {
          return bonus.type + (bonus.modifier ? " +" + bonus.modifier : "");
        })
        .join(", ");
    }
  },
  methods: {
    buildSquad() {
      this.$store.dispatch("battle/testAction", {
        action: "buildSquad"
      });
    },
    maxSquad() {
      this.$store.dispatch("battle/testAction", {
        action: "maxSquad"
      });
    },
    async clickHandler({ unit, index }) {
      if (!unit) {
        this.updateUnitHandler(index);
        return;
      }
      const unitIndex = this.fighters.findIndex(
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
