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

      <span class="icon-dkt flex-1"></span>
      <span
        v-if="!disable"
        class="flex-2 font-size-25 font-weight-900 margin-right-2"
        @click="setMax"
        >{{ $t("max") }}</span
      >
    </div>

    <AvailableLabel title="available" :currencyType="currency" @max="setMax" />
  </div>
</template>

<script>
import AvailableLabel from "./AvailableLabel.vue";

export default {
  components: { AvailableLabel },
  props: ["value", "currency", "disable"],
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
      return this.$game.inventory.getCurrency(this.currency, 6);
    }
  },
  methods: {
    reset() {
      this.valueInput = 0;
    },
    setMax() {
      this.valueInput = this.$game.inventory.getCurrency(this.currency, 6);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
