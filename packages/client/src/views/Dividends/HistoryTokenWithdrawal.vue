<template>
  <div
    class="flex flex-column flex-items-start flex-center color-panel-1 padding-left-1"
    :class="{ 'color-panel-2': odd }"
  >
    <span class="font-size-18 margin-bottom-1">{{
      $t("with-id", { tx: id })
    }}</span>

    <span class="font-size-18 margin-bottom-1">{{
      $t("with-date", { date: dateFormatted })
    }}</span>

    <IconWithValue
      valueClass="font-size-18"
      :iconClass="`icon-${data.currency}`"
      :flip="true"
      >{{ amount }}</IconWithValue
    >

    <CustomButton
      class="margin-top-2 flex-self-end"
      v-if="data.pending"
      @click="withdraw"
      >{{ $t("btn-withd") }}</CustomButton
    >
  </div>
</template>

<script>
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import WalletMixin from "@/components/WalletMixin.vue";

export default {
  mixins: [BlockchainUtilsMixin, NetworkRequestErrorMixin, WalletMixin],
  props: ["data", "odd", "date", "id", "chain"],
  components: { CustomButton, IconWithValue },
  computed: {
    amount() {
      return this.toDecimal(this.chain, this.data.amount);
    },
    dateFormatted() {
      return new Date(this.date);
    }
  },
  methods: {
    async withdraw() {
      await this.showWallet(this.chain);
      await this.performRequest(
        this.$game.blockchain.finishTokenWithdrawal(
          this.data.currency,
          this.id,
          this.data.amount,
          this.data.nonce,
          this.data.signature
        )
      );

      this.data.pending = false;
    }
  }
};
</script>
