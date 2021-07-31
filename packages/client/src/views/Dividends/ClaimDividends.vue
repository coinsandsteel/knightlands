<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column widht-100 flex-items-start">
      <InputLabel title="address" />
      <AddressInput v-model="address" />

      <InputLabel title="network" />
      <NetworkSelector :lockTo="chain" />

      <InputLabel title="amount" />
      <div class="flex flex-center input-bg width-100">
        <input
          class="input flex-11 font-size-30 white-font"
          :value="formattedAmount"
          :disabled="true"
        />
        <span class="flex-1" :class="getIcon(chain)"></span>
      </div>

      <div class="flex flex-center width-100">
        <CustomButton
          class="margin-top-3"
          width="25rem"
          type="yellow"
          @click="claim"
          :disabled="cantClaim"
          >{{ $t("btn-claim") }}</CustomButton
        >
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

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    PromptMixin,
    BlockchainUtilsMixin
  ],
  components: {
    AddressInput,
    CustomButton,
    NetworkSelector,
    InputLabel
  },
  props: ["chain", "amount"],
  data: () => ({
    address: ""
  }),
  created() {
    this.title = "w-divs-claim";
    this.$options.useRouterBack = true;
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
      return this.toDecimal(this.chain, this.amount);
    }
  },
  methods: {
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
          await this.performRequestNoCatch(
            this.$game.claimDividends(this.address, this.chain)
          );
          this.$router.back();
        } catch {
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
