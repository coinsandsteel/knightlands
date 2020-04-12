<template>
  <div class="screen-content">
    <div v-bar v-if="shop">
      <div>
        <div class="flex flex-space-evenly">
          <RaceShopElement
            v-for="item in shop.items"
            :key="item.item"
            :item="item.item"
            :quantity="item.count"
            :price="item.price"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RaceShopElement from "./RaceShopElement.vue";

export default {
  mixins: [AppSection],
  components: { RaceShopElement },
  data: () => ({
    shop: null
  }),
  created() {
    this.title = "race-shop";
  },
  async mounted() {
    this.shop = await this.$game.getRaceShop();
  }
};
</script>