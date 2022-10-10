<template>
  <div class="flex flex-column flex-full overflow-auto">
    <div class="screen-background"></div>
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <div class="padding-2">
        <div class="font-size-22 text-align-center margin-bottom-2">
          <div v-if="power">Power: {{ power }}</div>
          <div v-if="bonuses && bonuses.length > 0" class="margin-top-1">
            Current squad bonuses:
            <div>{{ bonuses }}</div>
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
          <CustomButton type="blue" @click="buildSquad"
            >Build squad</CustomButton
          >
          <CustomButton type="red" @click="maxSquad">Maximize</CustomButton>
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
        const unit = this.inventory.find(
          ({ unitId }) => fighter.unitId === unitId
        );
        return prev + (unit ? unit.power || 0 : 0);
      }, 0);
    },
    bonuses() {
      let bonusItems = (this.game && this.game.userSquad
        ? this.game.userSquad.bonuses || []
        : []
      ).filter(({ type }) => type);

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
        .filter(str => !!str)
        .join(" / ");
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
        result = `Attack ${value > 0 ? "+" : ""}${value}%`;
      } else if (
        bonus.target === "hp" &&
        bonus.mode === "constant" &&
        bonus.operation === "multiply"
      ) {
        const value = Math.floor((bonus.value - 1) * 100);
        result = `HP ${value > 0 ? "+" : ""}${value}%`;
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "constant" &&
        bonus.operation === "multiply"
      ) {
        const value = Math.floor((bonus.value - 1) * 100);
        result = `Defense ${value > 0 ? "+" : ""}${value}%`;
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
          result = "Swamp 1 (-25%)";
        } else if (bonus.scheme === "swamp-2") {
          result = "Swamp 2 (-50%)";
        } else if (bonus.scheme === "swamp-3") {
          result = "Swamp 3 (-75%)";
        } else if (bonus.scheme === "swamp-4") {
          result = "Swamp 4 (-100%)";
        }
      } else if (
        bonus.target === "power" &&
        bonus.mode === "constant" &&
        bonus.terrain === "hill"
      ) {
        if (bonus.scheme === "hill-1") {
          result = "Hills 1 (+25%)";
        } else if (bonus.scheme === "hill-2") {
          result = "Hills 2 (+50%)";
        } else if (bonus.scheme === "hill-3") {
          result = "Hills 3 (+75%)";
        } else if (bonus.scheme === "hill-4") {
          result = "Hills 4 (+100%)";
        }
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "constant" &&
        bonus.terrain === "woods"
      ) {
        if (bonus.scheme === "woods-1") {
          result = "Woods 1 (+25%)";
        } else if (bonus.scheme === "woods-2") {
          result = "Woods 2 (+50%)";
        } else if (bonus.scheme === "woods-3") {
          result = "Woods 3 (+75%)";
        } else if (bonus.scheme === "woods-4") {
          result = "Woods 4 (+100%)";
        }
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "constant" &&
        bonus.terrain === "ice"
      ) {
        if (bonus.scheme === "ice-1") {
          result = "Ice 1 (-25%)";
        } else if (bonus.scheme === "ice-2") {
          result = "Ice 2 (-50%)";
        } else if (bonus.scheme === "ice-3") {
          result = "Ice 3 (-75%)";
        } else if (bonus.scheme === "ice-4") {
          result = "Ice 4 (-100%)";
        }
      } else if (
        bonus.subEffect === "lava_damage" &&
        bonus.mode === "constant" &&
        bonus.terrain === "lava"
      ) {
        if (bonus.scheme === "lava-1") {
          result = "Lava 1 (-25%)";
        } else if (bonus.scheme === "lava-2") {
          result = "Lava 2 (-50%)";
        } else if (bonus.scheme === "lava-3") {
          result = "Lava 3 (-75%)";
        } else if (bonus.scheme === "lava-4") {
          result = "Lava 4 (-100%)";
        }
      } else if (
        bonus.target === "defence" &&
        bonus.mode === "stack" &&
        bonus.trigger === "damage" &&
        bonus.operation === "add" &&
        bonus.value &&
        bonus.max === "add"
      ) {
        result = `When a squad member takes damage the squad's defense is increased by +${bonus.value} (max. ${bonus.max})`;
      } else if (
        bonus.subEffect === "counter_attack" &&
        bonus.mode === "burst" &&
        bonus.probability
      ) {
        result = `Chance of a counter attack ${bonus.probability}%`;
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
        const delta = (bonus.delta * 100).toFixed(1);
        const max = bonus.max * 100;
        result = `When a squad member takes damage the squad's attack is increased by ${delta}% (max. ${max}%)`;
      } else if (
        bonus.target === "power" &&
        bonus.mode === "burst" &&
        bonus.operation === "multiply" &&
        bonus.value &&
        bonus.probability
      ) {
        const probability = bonus.probability * 100;
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
