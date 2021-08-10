<template>
  <div class="width-100 flex flex-column flex-items-start">
    <div class="flex flex-center input-bg width-100">
      <input
        class="input flex-11 font-size-30 white-font"
        placeholder="0"
        type="number"
        v-model="valueInput"
        :disabled="disable"
      />

      <span class="flex-1" :class="`icon-${currency}`"></span>
      <span
        v-if="!disable"
        class="flex-2 font-size-25 font-weight-900 margin-right-2 pointer"
        @click="setMax"
        >{{ $t("max") }}</span
      >
    </div>

    <AvailableLabel
      class="margin-top-1"
      title="available"
      :currencyType="currency"
      :balance="tokenBalance"
      @max="setMax"
    />
  </div>
</template>

<script>
import AvailableLabel from "./AvailableLabel.vue";

export default {
  components: { AvailableLabel },
  props: ["value", "currency", "disable", "max"],
  data: () => ({
    valueInput: 0
  }),
  watch: {
    value: {
      immediate: true,
      handler() {
        this.valueInput = this.value;
      }
    },
    valueInput() {
      this.$emit("input", this.valueInput + "");
    }
  },
  computed: {
    tokenBalance() {
      if (this.max !== undefined && this.max !== null) {
        return this.max;
      }
      return this.$game.inventory.getCurrency(this.currency, 6);
    }
  },
  methods: {
    reset() {
      this.valueInput = 0;
    },
    setMax() {
      this.valueInput = this.tokenBalance;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
