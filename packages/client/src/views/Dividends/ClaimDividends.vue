<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column widht-100 flex-items-start">
      <InputLabel title="address" />
      <AddressInput v-model="address" />

      <InputLabel title="network" />
      <NetworkSelector v-model="chain" />

      <InputLabel title="amount" />
      <div class="flex flex-center input-bg width-100">
        <input
          class="input flex-11 font-size-30 white-font"
          :value="formattedAmount"
          :disabled="true"
        />
        <span class="flex-1" :class="getIcon(chain)"></span>
      </div>

      <div class="flex flex-center flex-column width-100">
        <CustomButton
          class="margin-top-3"
          width="25rem"
          type="yellow"
          @click="claim"
          :disabled="cantClaim || hasPendingDivs"
          >{{ $t("btn-claim") }}</CustomButton
        >
        <template v-if="hasPendingDivs">
          <span class="font-error font-size-25 font-weight-900 margin-top-2">{{
            $t("pen-withd")
          }}</span>
          <CustomButton type="grey" @click="withdraw">{{
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
import AddressInput from "./AddressInput.vue";
import InputLabel from "./InputLabel.vue";
import NetworkSelector from "./NetworkSelector.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin.vue";
import WalletMixin from "@/components/WalletMixin.vue";
import Events from "@/../../knightlands-shared/events";

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    PromptMixin,
    BlockchainUtilsMixin,
    WalletMixin
  ],
  components: {
    AddressInput,
    CustomButton,
    NetworkSelector,
    InputLabel
  },
  data: () => ({
    address: "",
    chain: "",
    divsPendingUpdated: 0
  }),
  created() {
    this.title = "w-divs-claim";
    this.$options.useRouterBack = true;
    this._handler = async data => {
      const record = await this.pendingDivs;
      if (record && record._id == data.id) {
        this.divsPendingUpdated++;
      }
    };
  },
  activated() {
    this.$game.on(Events.DivTokenWithdrawal, this._handler);
  },
  deactivated() {
    this.$game.off(Events.DivTokenWithdrawal, this._handler);
  },
  asyncComputed: {
    async hasPendingDivs() {
      return !!(await this.pendingDivs);
    },
    pendingDivs: {
      async get() {
        const divs = await this.performRequest(
          this.$game.getPendingDivs(this.chain)
        );
        return divs && divs.length > 0 ? divs[0] : null;
      },
      watch: ["divsPendingUpdated"]
    }
  },
  computed: {
    cantClaim() {
      return (
        this.chain == "" ||
        this.amount == "0" ||
        !this.isAddress(this.chain, this.address)
      );
    },
    noAmount() {
      return !/^((0(\.\d{1,18})?)|([1-9]\d*(\.\d{1,18})?))$/.test(this.amount);
    },
    formattedAmount() {
      return this.toDecimal(this.chain, this.amount || "0");
    },
    amount() {
      return this.$game.dividends.claimed[this.chain] || "0";
    }
  },
  methods: {
    async withdraw() {
      const divs = (await this.pendingDivs)[0];
      await this.showWallet(this.chain);
      await this.performRequest(
        this.$game.blockchain.finishDividendsWithdrawal(
          divs._id,
          divs.data.amount,
          divs.data.nonce,
          divs.data.signature
        )
      );
    },
    async claim() {
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
        try {
          const data = await this.performRequestNoCatch(
            this.$game.withdrawDividends(this.address, this.chain)
          );
          await this.showWallet(this.chain);
          await this.performRequest(
            this.$game.blockchain.finishDividendsWithdrawal(
              data._id,
              data.amount,
              data.nonce,
              data.signature
            )
          );
          this.divsPendingUpdated++;
          this.$router.back();
        } catch (exc) {
          this.showPrompt(
            this.$t("prompt-snap-title"),
            this.$t("div-claim-failed"),
            [
              {
                type: "red",
                title: "btn-ok",
                response: true
              }
            ]
          );
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>
