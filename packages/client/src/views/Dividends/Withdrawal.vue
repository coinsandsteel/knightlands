<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column widht-100 flex-items-start">
      <InputLabel title="address" />
      <AddressInput v-model="address" />

      <InputLabel title="network" />
      <NetworkSelector @confirm="handleNetwork" />

      <InputLabel title="amount" />
      <TokenInput v-model="amount" :currency="currencyType" />

      <div class="flex flex-center width-100">
        <CustomButton
          class="margin-top-3"
          type="yellow"
          :disabled="cantWithdraw"
          @click="withdaw"
          >{{ $t("btn-withdraw") }}</CustomButton
        >
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
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";

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
    InputLabel
  },
  data: () => ({
    amount: "0",
    currencyType: CurrencyType.Dkt,
    selectedNetwork: "",
    address: ""
  }),
  created() {
    this.title = "w-token-withdrawal";
  },
  computed: {
    cantWithdraw() {
      return (
        this.selectedNetwork == "" ||
        this.noAmount ||
        !this.isAddress(this.selectedNetwork, this.address)
      );
    },
    noAmount() {
      return !/^((0(\.\d{1,2})?)|([1-9]\d*(\.\d{1,2})?))$/.test(this.amount);
    }
  },
  methods: {
    handleNetwork(network) {
      this.selectedNetwork = network;
    },
    async withdaw() {
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
        await this.performRequest(
          this.$game.withdrawTokens(this.currencyType, this.amount)
        );
      }
    }
  }
};
</script>
