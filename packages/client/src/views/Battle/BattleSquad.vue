<template>
  <div class="flex flex-column flex-full overflow-auto">
    <div class="screen-background"></div>
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <div class="padding-2">
        <div class="font-size-22 text-align-center margin-bottom-2">
          <div v-if="power">Power: {{ power }}</div>
          <div v-if="bonuses && bonuses.length > 0" class="margin-top-1">
            Squad bonuses:
            <div
              class="rarity-rare"
              v-for="(bonus, index) in bonuses"
              :key="index"
            >
              {{ bonus }}
            </div>
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
        <!-- <CustomButton
          v-if="fighters.length < 5"
          type="green"
          class="inline-block"
          width="8rem"
          @click="updateUnitHandler(fighters.length)"
          >{{ $t("add") }}</CustomButton
        > -->
        <portal to="footer" :slim="true" v-if="isActive">
          <template v-if="false">
            <CustomButton v-if="false" type="blue" @click="buildSquad"
              >Build squad</CustomButton
            >
            <CustomButton v-if="false" type="yellow" @click="makeTier2"
              >Set tier 2</CustomButton
            >
            <CustomButton v-if="false" type="yellow" @click="makeTier3"
              >Set tier 3</CustomButton
            >
            <CustomButton v-if="false" type="red" @click="maxSquad"
              >Maximize</CustomButton
            >
          </template>
        </portal>
      </div>
    </div>
  </div>
</template>
<script>
// import { create } from "vue-modal-dialogs";
import { mapState } from "vuex";
// import BattleUnit from "@/views/Battle/BattleUnit.vue";
// import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import AppSection from "@/AppSection.vue";
// import AppSection from "@/AppSection.vue";
// import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";

export default {
  mixins: [AppSection, ActivityMixin],
  components: {
    // BattleUnit,
    BattleUnitList
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game", "inventory"]),
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
      return this.fighters.reduce((prev, fighter) => {
        if (!fighter) {
          return prev + 0;
        }
        // const unit = this.inventory.find(
        //   ({ unitId }) => fighter.unitId === unitId
        // );
        const unit = fighter.unit;
        return prev + (unit ? unit.power || 0 : 0);
      }, 0);
    },
    bonuses() {
      let bonusItems = (this.game && this.game.userSquad
        ? this.game.userSquad.bonuses || []
        : []
      ).filter(({ mode }) => mode);

      // bonusItems = [
      //   {
      //     target: "attack",
      //     mode: "constant",
      //     operation: "multiply",
      //     value: 1.5
      //   },
      //   {
      //     target: "speed",
      //     mode: "constant",
      //     trigger: "debuff",
      //     operation: "multiply",
      //     value: 4
      //   },
      //   {
      //     target: "attack",
      //     mode: "constant",
      //     operation: "multiply",
      //     value: 1.1
      //   },
      //   {
      //     target: "attack",
      //     mode: "stack",
      //     delta: 0.025,
      //     trigger: "damage",
      //     multiply: true,
      //     max: 0.15
      //   }
      // ];

      if (!bonusItems.length > 0) {
        return null;
      }
      return bonusItems
        .map(bonus => {
          return this.renderBonus(bonus);
        })
        .filter(str => !!str);
    }
  },
  activated() {
    this.title = this.$t("Squad");
  },
  methods: {
    renderBonus(bonus) {
      let result = "";

      if (
        bonus.target === "attack" &&
        bonus.mode === "constant" &&
        bonus.operation === "multiply"
      ) {
        const value = Math.floor((bonus.value - 1) * 100);
        result = `Attack power ${value > 0 ? "+" : ""}${value}%`;
      } else if (
        bonus.target === "hp" &&
        bonus.mode === "constant" &&
        bonus.operation === "multiply"
      ) {
        const value = Math.floor((bonus.value - 1) * 100);
        result = `Max. HP ${value > 0 ? "+" : ""}${value}%`;
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "constant" &&
        bonus.operation === "multiply"
      ) {
        const value = Math.floor((bonus.value - 1) * 100);
        result = `Defence ${value > 0 ? "+" : ""}${value}%`;
      } else if (
        bonus.target === "abilities" &&
        bonus.mode === "constant" &&
        bonus.operation === "multiply"
      ) {
        const value = Math.floor((bonus.value - 1) * 100);
        result = `Abilities power ${value > 0 ? "+" : ""}${value}%`;
      } else if (
        bonus.target === "speed" &&
        bonus.mode === "constant" &&
        bonus.terrain === "swamp"
      ) {
        if (bonus.scheme === "swamp-1") {
          result = "Swamp effect is 25% weaker";
        } else if (bonus.scheme === "swamp-2") {
          result = "Swamp effect is 50% weaker";
        } else if (bonus.scheme === "swamp-3") {
          result = "Swamp effect is 75% weaker";
        } else if (bonus.scheme === "swamp-4") {
          result = "Swamp effect is 100% weaker";
        }
      } else if (
        bonus.target === "power" &&
        bonus.mode === "constant" &&
        bonus.terrain === "hill"
      ) {
        if (bonus.scheme === "hill-1") {
          result = "Hills effect is 25% stronger";
        } else if (bonus.scheme === "hill-2") {
          result = "Hills effect is 50% stronger";
        } else if (bonus.scheme === "hill-3") {
          result = "Hills effect is 75% stronger";
        } else if (bonus.scheme === "hill-4") {
          result = "Hills effect is 100% stronger";
        }
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "constant" &&
        bonus.terrain === "woods"
      ) {
        if (bonus.scheme === "woods-1") {
          result = "Woods effect is 25% stronger";
        } else if (bonus.scheme === "woods-2") {
          result = "Woods effect is 50% stronger";
        } else if (bonus.scheme === "woods-3") {
          result = "Woods effect is 75% stronger";
        } else if (bonus.scheme === "woods-4") {
          result = "Woods effect is 100% stronger";
        }
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "constant" &&
        bonus.terrain === "ice"
      ) {
        if (bonus.scheme === "ice-1") {
          result = "Ice effect is 25% weaker";
        } else if (bonus.scheme === "ice-2") {
          result = "Ice effect is 50% weaker";
        } else if (bonus.scheme === "ice-3") {
          result = "Ice effect is 75% weaker";
        } else if (bonus.scheme === "ice-4") {
          result = "Ice effect is 100% weaker";
        }
      } else if (
        bonus.subEffect === "lava_damage" &&
        bonus.mode === "constant" &&
        bonus.terrain === "lava"
      ) {
        if (bonus.scheme === "lava-1") {
          result = "Lava effect is 25% weaker";
        } else if (bonus.scheme === "lava-2") {
          result = "Lava effect is 50% weaker";
        } else if (bonus.scheme === "lava-3") {
          result = "Lava effect is 75% weaker";
        } else if (bonus.scheme === "lava-4") {
          result = "Lava effect is 100% weaker";
        }
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "stack" &&
        bonus.trigger === "damage" &&
        bonus.operation === "add" &&
        bonus.value &&
        bonus.max
      ) {
        result = `When a squad member takes damage the squad's defence is increased by +${bonus.value} (max. ${bonus.max})`;
      } else if (
        bonus.subEffect === "counter_attack" &&
        bonus.mode === "burst" &&
        bonus.probability
      ) {
        const value = Math.floor(bonus.probability * 100);
        result = `Chance of a counter attack ${value}%`;
      } else if (
        bonus.target === "speed" &&
        bonus.mode === "constant" &&
        bonus.trigger === "debuff"
      ) {
        const value = bonus.value || bonus.delta;
        result = `When a unit is debuffed, their speed is increased by +${value}`;
      } else if (
        bonus.target === "attack" &&
        bonus.mode === "stack" &&
        bonus.trigger === "damage" &&
        bonus.multiply &&
        bonus.delta &&
        bonus.max
      ) {
        const delta = Math.round(bonus.delta * 10000) / 100;
        const max = Math.round(bonus.max * 10000) / 100;
        result = `When a squad member takes damage the squad's attack is increased by ${delta}% (max. ${max}%)`;
      } else if (
        bonus.target === "power" &&
        bonus.mode === "burst" &&
        bonus.operation === "multiply" &&
        bonus.value &&
        bonus.probability
      ) {
        const probability = Math.round(bonus.probability * 10000) / 100;
        result = `Chance to deal a critical hit ${probability}% (damage x${bonus.value})`;
      }

      return result;
    },
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
    makeTier2() {
      this.$store.dispatch("battle/testAction", {
        action: "makeSquadTier2"
      });
    },
    makeTier3() {
      this.$store.dispatch("battle/testAction", {
        action: "makeSquadTier3"
      });
    },
    async clickHandler({ unit, index }) {
      // if (!unit) {
      //   this.updateUnitHandler(index);
      //   return;
      // }
      // const unitIndex = this.fighters.findIndex(
      //   fighter => fighter && unit.unitId === fighter.unitId
      // );
      // if (!(unitIndex > -1)) {
      //   return;
      // }

      // this.updateUnitHandler(unitIndex);
      this.updateUnitHandler(index);
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
    },
    handleBackButton() {
      this.$router.replace({ name: "battle-menu" });
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
