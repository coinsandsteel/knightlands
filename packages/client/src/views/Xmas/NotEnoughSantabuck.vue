<template>
  <UserDialog @close="$close(true)" title="Purchase Santabucks">
    <template v-slot:content>
      <PaymentStatus
        :cancel="true"
        @purchase="purchase"
        @pay="continuePurchase"
        @cancel="cancelPurchase"
      >
        <div class="shop-container">
          <div class="outer" v-for="data in iaps" :key="data.iap">
            <div class="inner flex flex-column flex-center gold-pack">
              <img src="../../assets/xmas/item_bucks.png" />
              <div class="padding-1 price-l">
                <IconWithValue iconClass="icon-sb">{{
                  data.count
                }}</IconWithValue>
              </div>
              <CustomButton
                class="margin-top-1 margin-bottom-1"
                type="grey"
                minWidth="15rem"
                @click="purchase(data.iap)"
              >
                <PriceTag :iap="data.iap" :dark="true" />
              </CustomButton>
            </div>
          </div>
        </div>
      </PaymentStatus>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import PriceTag from "@/components/PriceTag.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";

import { create } from "vue-modal-dialogs";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ConnectWallet from "@/views/Account/ConnectWallet.vue";
const ShowWallet = create(ConnectWallet);
const IAPS = [
  { iap: "sb_1", count: 9999 },
  { iap: "sb_2", count: 9999 },
  { iap: "sb_3", count: 9999 },
  { iap: "sb_4", count: 9999 },
  { iap: "sb_5", count: 9999 },
  { iap: "sb_6", count: 9999 }
];

export default {
  mixins: [NetworkRequestErrorMixin, PaymentHandler],
  components: {
    UserDialog,
    CustomButton,
    IconWithValue,
    PriceTag,
    PaymentStatus
  },
  data: () => ({
    iaps: IAPS
  }),
  mounted() {
    this.fetchPaymentStatus();
  },
  methods: {
    async purchase(iap) {
      const result = await ShowWallet();
      if (result) {
        await this.performRequest(
          this.purchaseRequest(this.$game.purchase(iap))
        );
      }
    },
    async fetchPaymentStatus() {
      await this.performRequest(this.$store.dispatch("shop/refreshStatus"));
    }
  }
};
</script>

<style lang="less" scoped>
.outer {
  position: relative;

  &:before {
    content: "";
    width: 100%;
    display: inline-block;
    padding-bottom: calc(100% / (9 / 16));
  }

  & > .inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.shop-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: stretch;
  row-gap: 1rem;
  column-gap: 1rem;
}

.gold-pack {
  // background-image: url("../../assets/xmas/buy_bg.png");
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  // background-position: center;

  border-image: url("../../assets/ui/shop_packs_bg.svg");
  border-image-slice: 19 fill;
  border-image-width: 18px;
  border-image-repeat: stretch stretch;

  & img {
    max-width: 100%;
  }

  & .price-l {
    width: calc(100% - 6px);
    background-color: #172b44;
  }
}
</style>
