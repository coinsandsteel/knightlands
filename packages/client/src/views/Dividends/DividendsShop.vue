<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>

    <div class="flex flex-center margin-bottom-2 margin-top-2">
      <span class="font-size-20">{{ $t("du-balance") }}</span>

      <IconWithValue class="balance" iconClass="icon-dkt2">{{
        $game.dkt2
      }}</IconWithValue>
    </div>

    <div class="width-100" v-bar>
      <div class="width-100">
        <Title :stackBottom="true">{{ $t("divs-mining") }}</Title>
        <DividendsMining
          @upgradeMining="upgradeMining"
          @collect="collectMining"
        />

        <Title :stackTop="true" :stackBottom="true">{{
          $t("divs-rate")
        }}</Title>
        <DividendsDropRate @upgrade="upgradeDktDrop" />

        <!-- <Title :stackTop="true">{{ $t("divs-shop") }}</Title>
        <div class="divs-shop width-100">
          <DividendsShopElement
            v-for="item in shopItems"
            :key="item.item"
            :item="item.item"
            :quantity="item.quantity"
            :price="item.price"
            :locked="!canPurchase(item.price)"
            @purchase="purchase(item)"
          />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import DividendsShopElement from "./DividendsShopElement.vue";
import DividendsMining from "./DividendsMining.vue";
import DividendsDropRate from "./DividendsDropRate.vue";
import DividendsMeta from "@/dividends";
import IconWithValue from "@/components/IconWithValue.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";
const ShowItems = create(ItemsReceived, "items");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  created() {
    this.title = "w-divs-shop";
  },
  components: {
    IconWithValue,
    DividendsShopElement,
    Title,
    DividendsMining,
    DividendsDropRate
  },
  computed: {
    shopItems() {
      return DividendsMeta.shop;
    }
  },
  methods: {
    async purchase(item) {
      await this.performRequest(this.$game.purchaseDktShopItem(item.item));
      await ShowItems([item]);
    },
    canPurchase(price) {
      return this.$game.dividends.unlockedTokens >= price;
    },
    async upgradeMining() {
      await this.performRequest(this.$game.upgradeDktMining());
    },
    async collectMining() {
      await this.performRequest(this.$game.collectDktMining());
    },
    async upgradeDktDrop() {
      await this.performRequest(this.$game.upgradeDktDropRate());
    }
  }
};
</script>

<style lang="less" scoped>
.divs-shop {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
</style>
