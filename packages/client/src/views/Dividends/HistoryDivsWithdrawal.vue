<template>
  <div
    class="flex flex-column flex-items-start flex-center color-panel-1 padding-left-2 padding-right-2"
    :class="{ 'color-panel-2': odd }"
  >
    <span class="font-size-20 margin-bottom-1">{{
      $t("with-id", { tx: id })
    }}</span>

    <span class="font-size-20 margin-bottom-1">{{
      $t("with-date", { date })
    }}</span>

    <IconWithValue
      valueClass="font-size-20"
      :iconClass="getIcon(data.blockchainId)"
      :flip="true"
      >{{ amount }}</IconWithValue
    >

    <div class="flex flex-end width-100" v-if="pending && !cancelled">
      <CustomButton
        class="margin-top-2 flex-self-end"
        type="yellow"
        v-if="!outOfTime"
        @click="withdraw"
        >{{ $t("btn-withd") }}</CustomButton
      >
      <CustomButton
        class="margin-top-2 flex-self-end"
        type="red"
        v-if="!outOfTime"
        >{{ $t("tx-canceli", { timer: deadline.value }) }}</CustomButton
      >
      <CustomButton
        class="margin-top-2 flex-self-end"
        type="red"
        @click="cancel"
        v-else
        >{{ $t("btn-cancel") }}</CustomButton
      >
    </div>
    <CustomButton
      @click="showTx"
      v-else-if="!pending"
      type="grey"
      class="margin-top-2 flex-self-end"
    >
      {{ $t("show-tx") }}
    </CustomButton>
    <span class="margin-top-2 flex-self-end font-size-22" v-else>
      {{ $t("tx-cancel") }}
    </span>
  </div>
</template>

<script>
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import WalletMixin from "@/components/WalletMixin.vue";
import Timer from "@/timer";

export default {
  mixins: [BlockchainUtilsMixin, NetworkRequestErrorMixin, WalletMixin],
  props: ["data", "odd", "id", "chain", "pending", "cancelled"],
  components: { CustomButton, IconWithValue },
  data: () => ({
    deadline: new Timer(false)
  }),
  computed: {
    amount() {
      return this.toDecimal(this.chain, this.data.amount);
    },
    date() {
      return new Date(this.data.date);
    },
    outOfTime() {
      return this.pending && this.deadline.timeLeft <= 0;
    }
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        this.deadline.timeLeft = this.data.deadline + 250 - this.$game.nowSec;
      }
    }
  },
  methods: {
    async cancel() {
      await this.performRequest(this.$game.cancelDivsWithdrawal(this.id));
    },
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
          this.data.deadline,
          this.data.signature
        )
      );
    }
  }
};
</script>
