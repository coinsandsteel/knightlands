<template>
  <PaymentStatus :cancel="true" v-on="$listeners" class="width-100">
    <div class="shop-container">
      <TopUpShinies
        v-for="(entry, index) in shinies"
        :key="entry.iap"
        :data="entry"
        :index="index"
        @purchase="handlePurchase"
      />
    </div>

    <div class="shop-container margin-top-2">
      <TopUpShopElement
        v-for="entry in tickets"
        :key="entry.iap"
        :data="entry"
        @purchase="handlePurchase"
      />
    </div>
  </PaymentStatus>
</template>

<script>
import TopUpShinies from "./TopUpShinies.vue";
import Meta from "@/top_up_shop";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { TopUpShinies, PaymentStatus },
  data: () => ({
    shinies: Meta.shinies,
    tickets: Meta.raidTickets
  }),
  methods: {
    async handlePurchase(iap) {
      this.$emit("purchase", async () => {
        return this.$game.purchase(iap);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.shop-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(33%, 1fr));
  justify-items: stretch;
}
</style>
