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
        <AttackButton
          width="20rem"
          type="red"
          @click="$emit('attack', attacks)"
          :disabled="disabled"
          >Attack: x{{ attacks }}</AttackButton
        >
      </template>
    </NumericValue>
  </div>
</template>

<script>
import AttackButton from "@/components/AttackButton.vue";
import NumericValue from "@/components/NumericValue.vue";

export default {
  components: { AttackButton, NumericValue },
  props: ["disabled"],
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
