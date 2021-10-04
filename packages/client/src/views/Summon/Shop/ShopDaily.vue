<template>
  <div class="width-100" v-bar>
    <div class="shop-container">
      <DailyShopElement
        v-for="(item, idx) in items"
        :key="item.item"
        :index="idx"
        :data="item"
        @purchase="purchase(idx)"
      />

      <DailyShopElement
        v-for="(item, idx) in fixedItems"
        :key="item.item"
        :index="idx"
        :data="item"
        :fixed="true"
        @purchase="purchase(idx, true)"
      />
    </div>

    <portal to="footer" v-if="isActive">
      <span class="font-size-18">
        {{ $t("auto-r-d", { v: timer.value }) }}
      </span>

      <PurchaseButton type="grey" @click="refresh" :price="price">
        {{ $t("btn-refresh") }}
      </PurchaseButton>
    </portal>
  </div>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";
import DailyShopElement from "./DailyShopElement.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import DailyShopMeta from "@/daily_shop";
import Timer from "@/timer";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items");

export default {
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  components: { DailyShopElement, PurchaseButton, PromptMixin },
  data: () => ({
    timer: new Timer(true)
  }),
  computed: {
    fixedItems() {
      return DailyShopMeta.fixedItems;
    },
    items() {
      return this.$game.dailyShop.items;
    },
    price() {
      return DailyShopMeta.refreshPrice[this.$game.dailyShop.refreshes];
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.timer.removeAllListeners();
  },
  methods: {
    async init() {
      this.autoRefresh = this.refresh.bind(this);
      this.timer.timeLeft = 86400 - (this.$game.nowSec % 86400);
      this.timer.on("finished", this.autoRefresh);
    },
    async refresh() {
      await this.performRequest(this.$game.refreshDailyShop());
    },
    async purchase(itemIndex, fixed = false) {
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

      const item = await this.performRequest(
        this.$game.purchaseDailyItem(itemIndex, fixed)
      );
      await ShowDialog([item]);
    }
  }
};
</script>

<style lang="less" scoped>
.shop-container {
  width: 100%;
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: center;
}
</style>
