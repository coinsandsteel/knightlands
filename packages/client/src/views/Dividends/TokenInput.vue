<template>
  <div class="width-100 flex flex-column flex-items-start">
    <div class="flex flex-center input-bg width-100">
      <input
        class="input flex-11 font-size-30 white-font"
        placeholder="0"
        type="number"
        v-model="valueInput"
      />

      <span class="icon-dkt flex-1"></span>
      <span
        class="flex-2 font-size-25 font-weight-900 margin-right-2"
        @click="setMax"
        >{{ $t("max") }}</span
      >
    </div>

    <div class="flex flex-center margin-left-2">
      <span
        class="flex-2 font-size-18 grey-title font-weight-900 margin-right-1"
        @click="setMax"
        >{{ $t("available") }}</span
      >
      <IconWithValue
        iconClass="icon-dkt"
        valueClass="grey-title font-size-18"
        :flip="true"
        >{{ tokenBalance }}</IconWithValue
      >
    </div>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: { IconWithValue },
  props: ["value", "currency"],
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
      return this.$game.inventory.getCurrency(this.currency);
    }
  },
  methods: {
    setMax() {
      this.valueInput = this.$game.inventory.getCurrency(this.currency, 8);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
