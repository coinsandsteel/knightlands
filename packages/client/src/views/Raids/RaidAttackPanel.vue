<template>
  <div class="flex flex-space-evenly">
    <NumericValue
      :showMax="false"
      :value="attacks"
      :decreaseCondition="attacks > 1"
      :increaseCondition="canIncrease()"
      @inc="attacks++"
      @dec="attacks--"
    >
      <template v-slot:between>
        <AttackButton
          type="red"
          @click="$emit('attack', attacks)"
          :disabled="disabled"
        >
          <div class="flex flex-center">
            <span class="margin-right-half">{{
              $t("att-c", { dmg: attackDamage })
            }}</span>
            <IconWithValue iconClass="icon-stamina">{{
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
    }
  },
  methods: {
    canIncrease() {
      return (
        this.$game.character.maxStats[CharacterStats.Stamina] &&
        this.attacks < 50
      );
    }
  }
};
</script>
