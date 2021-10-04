<template>
  <div class="shop-container">
    <GoldShopElement
      v-for="(entry, idx) in gold"
      :key="idx"
      :index="idx"
      :data="entry"
      @purchase="handlePurchase(idx)"
    />
  </div>
</template>

<script>
import GoldShopElement from "./GoldShopElement.vue";
import Meta from "@/top_up_shop";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items", "soft");

export default {
  mixins: [NetworkRequestErrorMixin, PromptMixin],
  components: { GoldShopElement },
  data: () => ({
    gold: Meta.gold
  }),
  methods: {
    async handlePurchase(idx) {
      const response = await this.showPrompt(
        this.$t("buy-i-t"),
        this.$t("buy-i-q"),
        [
          {
            type: "red",
            title: this.$t("buy-i-n"),
            response: false
          },
          {
            type: "green",
            title: this.$t("buy-i-y"),
            response: true
          }
        ]
      );

      if (!response) {
        return;
      }

      const gold = await this.performRequest(this.$game.purchaseGold(idx));
      await ShowDialog([], gold);
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
