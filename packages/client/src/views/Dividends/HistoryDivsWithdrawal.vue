<template>
  <div
    class="flex flex-column flex-items-start flex-center color-panel-1 padding-left-1"
    :class="{ 'color-panel-2': odd }"
  >
    <span class="font-size-18 margin-bottom-1">{{
      $t("with-id", { tx: id })
    }}</span>

    <span class="font-size-18 margin-bottom-1">{{
      $t("with-date", { date })
    }}</span>

    <IconWithValue
      valueClass="font-size-18"
      :iconClass="getIcon(data.blockchainId)"
      :flip="true"
      >{{ amount }}</IconWithValue
    >

    <CustomButton
      class="margin-top-2 flex-self-end"
      type="green"
      @click="withdraw"
      v-if="pending"
      >{{ $t("btn-withd") }}</CustomButton
    >
    <CustomButton
      @click="showTx"
      v-else
      type="grey"
      class="margin-top-2 flex-self-end"
    >
      {{ $t("show-tx") }}
    </CustomButton>
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
  props: ["data", "odd", "id", "chain", "pending"],
  components: { CustomButton, IconWithValue },
  computed: {
    amount() {
      return this.toDecimal(this.chain, this.data.amount);
    },
    date() {
      return new Date(this.data.date);
    }
  },
  methods: {
    showTx() {
      window
        .open(
          `https://goerli.etherscan.io/tx/${this.data.transactionHash}`,
          "_blank"
        )
        .focus();
    },
    async withdraw() {
      await this.showWallet(this.chain);
      await this.performRequest(
        this.$game.blockchain.finishDividendsWithdrawal(
          this.id,
          this.data.amount,
          this.data.nonce,
          this.data.signature
        )
      );
    }
  }
};
</script>
