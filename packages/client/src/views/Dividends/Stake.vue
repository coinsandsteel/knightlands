<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column widht-100 flex-items-start">
      <InputLabel title="amount" />
      <TokenInput ref="input" v-model="amount" :currency="currencyType" />
      <AvailableLabel
        title="d-stake"
        class="margin-top-1"
        :balance="stakeAmount"
        :currencyType="stakedCurrency"
      />

      <div class="flex flex-center width-100">
        <CustomButton
          class="margin-top-3"
          type="yellow"
          :disabled="cantStake"
          @click="stake"
          >{{ $t("btn-stake") }}</CustomButton
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
import AvailableLabel from "./AvailableLabel.vue";
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
    TokenInput,
    CustomButton,
    InputLabel,
    AvailableLabel
  },
  data: () => ({
    amount: "",
    currencyType: CurrencyType.Dkt,
    stakedCurrency: CurrencyType.StakedDkt
  }),
  created() {
    this.title = "w-token-stake";
  },
  computed: {
    stakeAmount() {
      return this.$game.inventory.getCurrency(CurrencyType.StakedDkt, 6);
    },
    cantStake() {
      return (
        this.noAmount ||
        this.amount == "0" ||
        +this.amount > +this.$game.inventory.getCurrency(CurrencyType.Dkt, 6)
      );
    },
    noAmount() {
      return !/^((0(\.\d{1,6})?)|([1-9]\d*(\.\d{1,6})?))$/.test(this.amount);
    }
  },
  methods: {
    handleNetwork(network) {
      this.selectedNetwork = network;
    },
    async stake() {
      let ok = await this.showPrompt(
        this.$t("cnfrm-stake-title"),
        this.$t("cnfrm-stake-msg"),
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
        await this.performRequest(this.$game.stakeTokens(this.amount));
        this.$refs.input.reset();
        this.amount = "";
      }
    }
  }
};
</script>
