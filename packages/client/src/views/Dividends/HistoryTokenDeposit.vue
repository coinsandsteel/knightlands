<template>
  <div
    class="flex flex-column flex-items-start flex-center color-panel-1 padding-left-1"
    :class="{ 'color-panel-2': odd }"
  >
    <span class="font-size-18 margin-bottom-1">{{
      $t("dep-id", { tx: id })
    }}</span>

    <span class="font-size-18 margin-bottom-1">{{
      $t("with-date", { date: dateFormatted })
    }}</span>

    <IconWithValue
      valueClass="font-size-18"
      :iconClass="`icon-${data.currency}`"
      >{{ amount }}</IconWithValue
    >
  </div>
</template>

<script>
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import WalletMixin from "@/components/WalletMixin.vue";

export default {
  mixins: [BlockchainUtilsMixin, NetworkRequestErrorMixin, WalletMixin],
  props: ["data", "odd", "id", "date"],
  components: { IconWithValue },
  computed: {
    amount() {
      return this.toDecimal(this.data.blockchainId, this.data.amount);
    },
    dateFormatted() {
      return new Date(this.date);
    }
  }
};
</script>
