<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div class="width-100" v-bar v-if="shop">
      <div class="width-100">
        <div class="race-shop width-100">
          <RaceShopElement
            v-for="item in shop.items"
            :key="item.item"
            :item="item.item"
            :quantity="item.quantity"
            :price="item.price"
            @purchase="handlePurchase"
          />
        </div>
      </div>
    </div>

    <portal to="footer" v-if="isActive" :slim="true">
      <IconWithValue iconClass="icon-race-token">{{ chips }}</IconWithValue>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RaceShopElement from "./RaceShopElement.vue";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import IconWithValue from "@/components/IconWithValue.vue";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [AppSection, PromptMixin],
  components: { RaceShopElement, IconWithValue },
  data: () => ({
    shop: null
  }),
  created() {
    this.title = "race-shop";
  },
  async mounted() {
    this.shop = await this.$game.getRaceShop();
  },
  computed: {
    chips() {
      return this.$game.inventory.getCurrency(CurrencyType.RaceChips);
    }
  },
  methods: {
    async handlePurchase(templateId, price) {
      const template = this.$game.itemsDB.getTemplate(templateId);
      let response = await this.showPrompt(
        "prompt-confirm-title",
        this.$t("race-shop-confirm", {
          rarity: template.rarity,
          price: price,
          item: this.$t(template.caption)
        }),
        [
          { type: "yellow", title: "btn-ok", response: true },
          { type: "red", title: "btn-cancel", response: false }
        ]
      );

      if (response === true) {
        await this.$game.purchaseFromRaceShop(templateId);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.race-shop {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  justify-items: center;
}
</style>
