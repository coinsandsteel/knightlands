<template>
  <div class="flex flex-space-evenly">
    <NumericValue
      :showMax="false"
      :value="attacks"
      :decreaseCondition="attacks > 1"
      :increaseCondition="canIncrease()"
      @inc="attacks++"
      @dec="attacks--"
      @max="setMax"
      @reset="attacks = 1"
    >
      <template v-slot:between>
        <AttackButton
          type="red"
          @click="$emit('attack', attacks)"
          :disabled="disabled || notEnoughStamina"
        >
          <div class="flex flex-center flex-no-wrap font-size-18">
            <span class="margin-right-half">{{
              $t("att-c", { dmg: attackDamage })
            }}</span>
            <IconWithValue iconClass="icon-stamina" valueClass="font-size-18">{{
              attacks * staminaCost
            }}</IconWithValue>
          </div>
        </AttackButton>
      </template>
    </NumericValue>
  </div>
</template>

<script>
import CharacterStats from "@/../../knightlands-shared/character_stat.js";
import AttackButton from "@/components/AttackButton.vue";
import NumericValue from "@/components/NumericValue.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: { AttackButton, NumericValue, IconWithValue },
  props: ["disabled", "staminaCost"],
  data: () => ({
    attacks: 1
  }),
  computed: {
    attackDamage() {
      return Math.floor(this.attacks * 100 * (1 + 0.01 * (this.attacks - 1)));
    },
    currentStamina() {
      return this.$game.character.getTimer(CharacterStats.Stamina).value;
    },
    notEnoughStamina() {
      return this.currentStamina < this.attacks * this.staminaCost;
    }
  },
  methods: {
    checkStamina() {
      if (this.notEnoughStamina) {
        this.attacks = Math.floor(this.currentStamina / this.staminaCost);
      }
    },
    setMax() {
      this.attacks = Math.min(
        50,
        Math.floor(this.currentStamina / this.staminaCost)
      );
    },
    canIncrease() {
      return (
        this.currentStamina > this.attacks * this.staminaCost &&
        this.attacks < 50
      );
    }
  }
};
</script>
