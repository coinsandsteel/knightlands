<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column widht-100 flex-items-start">
      <InputLabel title="token" />
      <TokenSelector v-model="selectedToken" />

      <InputLabel title="address" />
      <AddressInput v-model="address" />

      <InputLabel title="network" />
      <NetworkSelector v-model="selectedNetwork" />

      <InputLabel title="amount" />
      <TokenInput v-model="amount" :currency="selectedToken" />

      <div class="flex flex-center flex-column width-100">
        <CustomButton
          class="margin-top-3"
          width="25rem"
          type="yellow"
          :disabled="cantWithdraw || hasPendingTokens"
          @click="withdraw"
          >{{ $t("btn-withdraw") }}</CustomButton
        >
        <template v-if="hasPendingTokens">
          <span class="font-error font-size-25 font-weight-900 margin-top-2">{{
            $t("pen-withd")
          }}</span>
          <CustomButton type="grey" @click="continueWithdrawal">{{
            $t("btn-pay")
          }}</CustomButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import PromptMixin from "@/components/PromptMixin.vue";
import AppSection from "@/AppSection.vue";
import TokenInput from "./TokenInput.vue";
import AddressInput from "./AddressInput.vue";
import InputLabel from "./InputLabel.vue";
import NetworkSelector from "./NetworkSelector.vue";
import TokenSelector from "./TokenSelector.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import Events from "@/../../knightlands-shared/events";
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
    AddressInput,
    TokenInput,
    CustomButton,
    NetworkSelector,
    InputLabel,
    TokenSelector
  },
  data: () => ({
    amount: "",
    selectedNetwork: "",
    address: "",
    selectedToken: "",
    withdawals: 0
  }),
  created() {
    this.title = "w-token-withdrawal";
    this.$options.useRouterBack = true;
    this._handler = async data => {
      const record = await this.pendingTokens;
      if (record && record._id == data.id) {
        this.withdawals++;
      }
    };
  },
  activated() {
    this.$game.on(Events.TokenWithdrawal, this._handler);
  },
  deactivated() {
    this.$game.off(Events.TokenWithdrawal, this._handler);
  },
  asyncComputed: {
    async hasPendingTokens() {
      return !!(await this.pendingTokens);
    },
    pendingTokens: {
      async get() {
        const divs = await this.performRequest(
          this.$game.getPendingDivs(this.selectedNetwork, this.selectedToken)
        );
        return divs && divs.length > 0 ? divs[0] : null;
      },
      watch: ["withdawals"]
    }
  },
  computed: {
    cantWithdraw() {
      return (
        this.selectedNetwork == "" ||
        this.selectedToken == "" ||
        this.noAmount ||
        this.amount == "0" ||
        !this.isAddress(this.selectedNetwork, this.address) ||
        +this.amount > +this.$game.inventory.getCurrency(this.selectedToken, 6)
      );
    },
    noAmount() {
      return !/^((0(\.\d{1,18})?)|([1-9]\d*(\.\d{1,18})?))$/.test(this.amount);
    }
  },
  methods: {
    async continueWithdrawal() {
      const record = await this.pendingTokens;
      await this.finishWithdrawal({
        _id: record._id,
        ...record.data
      });
    },
    async finishWithdrawal(withdrawal) {
      await ShowWallet(this.selectedNetwork);
      await this.performRequest(
        this.$game.blockchain.finishTokenWithdrawal(
          this.selectedToken,
          withdrawal._id,
          withdrawal.amount,
          withdrawal.nonce,
          withdrawal.signature
        )
      );
    },
    async withdraw() {
      let ok = await this.showPrompt(
        this.$t("cnfrm-wrawl-title"),
        this.$t("cnfrm-wrawl-msg"),
        [
          {
            type: "green",
            title: this.$t("btn-confirm"),
            response: true
          },
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          }
        ]
      );
      if (ok === true) {
        const withdrawal = await this.performRequest(
          this.$game.withdrawTokens(
            this.address,
            this.selectedToken,
            this.selectedNetwork,
            this.amount
          )
        );
        await this.finishWithdrawal(withdrawal);
        this.withdawals++;
        this.amount = "";
        this.$router.back();
      }
    }
  }
};
</script>
