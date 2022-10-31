<template>
  <div class="screen-content">
    <div class="hallowen-bg"></div>

    <div class="width-100" v-bar>
      <div class="flex flex-column">
        <img src="/images/halloween_assets/promo2.jpg" />

        <PaymentStatus
          :cancel="true"
          :overrideStatus="status"
          class="margin-top"
          @purchase="enter"
          @pay="continuePurchase"
          @cancel="cancelPurchase"
        >
          <div class="color-panel-4">
            <h1 class="font-weight-900 font-outline">
              Total prize pool: 6000$
            </h1>
          </div>

          <div class="margin-top-4 font-size-25 padding-left-1 padding-right-1">
            Full pass will allow you to particiapte in USDC pool and earn FULL
            rewards such as Raid Ticket, Shinies, FLESH and much more!
          </div>

          <div class="margin-top-4 flex flex-center">
            <CustomButton type="green" minWidth="20rem" @click="enter">
              Enter
              <PriceTag iap="halloween"></PriceTag>
            </CustomButton>
          </div>

          <div class="margin-top-4 flex flex-center flex-column color-panel-1">
            <span class="font-size-22 margin-bottom-1"
              >Enter for free without an access to USDC prize pool and full
              rewards.</span
            >

            <CustomButton
              v-if="notEntered"
              type="yellow"
              minWidth="20rem"
              @click="enterFree"
            >
              Free
            </CustomButton>
            <CustomButton
              v-else
              type="yellow"
              minWidth="20rem"
              @click="continueForFree"
            >
              Continue for free
            </CustomButton>
          </div>
        </PaymentStatus>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PriceTag from "@/components/PriceTag.vue";

import { mapState } from "vuex";

import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";
const ShowWallet = create(ConnectWallet);

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, PaymentHandler],
  components: { PaymentStatus, CustomButton, PriceTag },
  data: () => ({
    status: null,
  }),
  created() {
    this.title = "btn-evt-hal";
    this.$options.useRouterBack = true;
  },
  activated() {
    if (!this.notEntered) {
      this.enterFullyFree();
    }
  },
  watch: {
    "user.level"() {
      this.$router.replace({ name: "dungeon" });
    },
    isFree() {
      this.$router.replace({ name: "dungeon" });
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.dungeon.user,
      isFree: (state) => state.dungeon.maze.isFree,
    }),
    notEntered() {
      return this.user.level == 0;
    },
  },
  methods: {
    continueForFree() {
      this.$router.replace({ name: "dungeon" });
    },
    async fetchPaymentStatus() {
      this.status = await this.performRequest(
        this.$store.dispatch("dungeon/enter", { status: true })
      );
    },
    async enter() {
      const { chain, address } = await ShowWallet();
      await this.performRequest(
        this.purchaseRequest(
          this.$store.dispatch("dungeon/enter", { chain, address })
        )
      );
    },
    async enterFree() {
      await this.performRequest(
        this.$store.dispatch("dungeon/enter", { free: true })
      );
    },
    async enterFullyFree() {
      await this.performRequest(this.$store.dispatch("dungeon/enter"));
    },
  },
};
</script>

<style lang="less" scoped>
.hallowen-bg {
  background-color: #40374d;
  z-index: -1;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

img {
  max-width: 100%;
  max-height: 100%;
}

h1 {
  color: #aaf425;
}
</style>
