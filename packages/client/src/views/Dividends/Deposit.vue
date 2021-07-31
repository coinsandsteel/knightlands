<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column widht-100 flex-items-start">
      <InputLabel title="token" />
      <TokenSelector v-model="selectedToken" />

      <InputLabel title="network" />
      <NetworkSelector v-model="selectedNetwork" />

      <InputLabel title="amount" />
      <TokenInput v-model="amount" :currency="selectedToken" :max="max" />

      <div class="flex flex-center width-100">
        <CustomButton
          class="margin-top-3"
          width="25rem"
          type="yellow"
          :disabled="cantDeposit"
          @click="deposit"
          >{{ $t("btn-deposit") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import PromptMixin from "@/components/PromptMixin.vue";
import AppSection from "@/AppSection.vue";
import TokenInput from "./TokenInput.vue";
import InputLabel from "./InputLabel.vue";
import NetworkSelector from "./NetworkSelector.vue";
import TokenSelector from "./TokenSelector.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import { toDecimal } from "../../blockchain/utils";
import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";

const ShowWallet = create(ConnectWallet, "chain");

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    PromptMixin,
    BlockchainUtilsMixin
  ],
  components: {
    TokenInput,
    CustomButton,
    NetworkSelector,
    InputLabel,
    TokenSelector
  },
  data: () => ({
    amount: "",
    selectedNetwork: "",
    selectedToken: "",
    balance: 0
  }),
  created() {
    this.title = "w-token-deposit";
    this.$options.useRouterBack = true;
  },
  activated() {
    this.tryGetBalance();
  },
  watch: {
    selectedNetwork: {
      immediate: true,
      async handler() {
        if (!this.selectedNetwork) {
          return;
        }

        await ShowWallet(this.selectedNetwork);
        this.tryGetBalance();
      }
    },
    selectedToken: {
      immediate: true,
      handler() {
        this.tryGetBalance();
      }
    }
  },
  computed: {
    cantDeposit() {
      return (
        this.selectedNetwork == "" ||
        this.selectedToken == "" ||
        this.noAmount ||
        this.amount == "0"
      );
    },
    noAmount() {
      return !/^((0(\.\d{1,6})?)|([1-9]\d*(\.\d{1,6})?))$/.test(this.amount);
    },
    max() {
      return this.balance;
    }
  },
  methods: {
    async tryGetBalance() {
      if (this.selectedToken && this.selectedNetwork) {
        const bigAMount = await this.$game.blockchain.getTokenBalance(
          this.selectedToken
        );

        this.balance = toDecimal(bigAMount.toString(), 6);
      }
    },
    async deposit() {
      let ok = true;
      // let ok = await this.showPrompt(
      //   this.$t("cnfrm-dpst-title"),
      //   this.$t("cnfrm-wrawl-msg"),
      //   [
      //     {
      //       type: "green",
      //       title: this.$t("btn-confirm"),
      //       response: true
      //     },
      //     {
      //       type: "red",
      //       title: this.$t("btn-cancel"),
      //       response: false
      //     }
      //   ]
      // );
      if (ok === true) {
        await this.performRequest(
          this.$game.blockchain.depositTokens(
            this.selectedToken,
            this.$game.blockchain.getAddress(),
            this.$game.depositorId,
            this.amount
          )
        );

        this.amount = "";
      }
    }
  }
};
</script>
