<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <Tabs
      :tabs="tabs"
      @onClick="handleTab"
      :currentTab="currentTab"
      :router="true"
      :replace="true"
    />

    <keep-alive>
      <router-view
        @purchase="handlePurchase"
        @pay="continuePurchase"
        @cancel="cancelPurchase"
      ></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const ShowWallet = create(ConnectWallet);

const TabIds = {
  TopUp: "s-top-up",
  Subscription: "s-sub",
  Packs: "s-packs",
  Daily: "s-daily",
  Gold: "s-gold"
};

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, PaymentHandler],
  created() {
    this.title = "w-shop";
    this.$options.useRouterBack = true;
  },
  components: {
    Tabs
  },
  data: () => ({
    currentTab: TabIds.Daily,
    tabs: [
      {
        title: TabIds.Daily,
        value: TabIds.Daily,
        to: { name: "daily-shop" }
      },
      {
        title: TabIds.Packs,
        value: TabIds.Packs,
        to: { name: "packs" }
      },
      {
        title: TabIds.TopUp,
        value: TabIds.TopUp,
        to: {
          name: "top-up"
        }
      },
      {
        title: TabIds.Subscription,
        value: TabIds.Subscription,
        to: { name: "sub-shop" }
      },
      {
        title: TabIds.Gold,
        value: TabIds.Gold,
        to: { name: "shop-gold" }
      }
    ]
  }),
  activated() {
    this.fetchPaymentStatus();
  },
  methods: {
    handleTab(newTab) {
      this.currentTab = newTab;
    },
    async fetchPaymentStatus() {
      await this.performRequest(this.$store.dispatch("shop/refreshStatus"));
    },
    async handlePurchase(request) {
      const result = await ShowWallet();
      if (result) {
        await this.purchaseRequest(request());
      }
    }
  }
};
</script>
