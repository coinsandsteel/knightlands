<template>
  <div class="shop-container">
    <DailyShopElement
      v-for="(item, idx) in items"
      :key="item.item"
      :index="idx"
      :data="item"
      @purchase="purchase(idx)"
    />

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

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items");

export default {
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  components: { DailyShopElement, PurchaseButton },
  data: () => ({
    timer: new Timer(true)
  }),
  computed: {
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
    async purchase(itemIndex) {
      const item = await this.performRequest(
        this.$game.purchaseDailyItem(itemIndex)
      );
      await ShowDialog([item]);
    }
  }
};
</script>

<style lang="less" scoped>
.shop-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: center;
}
</style>
