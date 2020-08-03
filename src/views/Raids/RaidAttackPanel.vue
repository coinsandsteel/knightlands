<template>
  <div class="flex flex-space-evenly">
    <NumericValue
      :showMax="false"
      :value="attacks"
      :decreaseCondition="attacks > 1"
      :increaseCondition="hasEnoughResource()"
      @inc="attacks++"
      @dec="attacks--"
    >
      <template v-slot:between>
        <AttackButton width="20rem" type="red" @click="$emit('attack', attacks)">Attack: x{{attacks}}</AttackButton>
      </template>
    </NumericValue>
  </div>
</template>

<script>
import AttackButton from "@/components/AttackButton.vue";
import NumericValue from "@/components/NumericValue.vue";

export default {
  components: { AttackButton, NumericValue },
  data: () => ({
    attacks: 1
  }),
  methods: {
    hasEnoughResource() {
      return true;
    }
  }
};
</script>
