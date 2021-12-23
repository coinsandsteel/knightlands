<template>
  <div class="flex flex-column flex-center construct-element">
    <img class="building-type" :src="getBuildingType" />
    <div class="padding-2">
      <img src="/images/xmas/item_cp.png" />
      <PurchaseButton
        type="grey"
        class="margin-top-1"
        @click="handleClick"
        minWidth="10rem"
        :price="10.0"
        >{{ getState }}
      </PurchaseButton>
    </div>
  </div>
</template>
<script>
/*
states = {
    availableToBuy,
    availableToUpgrade,
    notEnoughCurrency
}

*/
// import IconWithValue from "@/components/IconWithValue.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";

export default {
  props: ['initialBuildingType'],
  components: {
    PurchaseButton
  },
  data() {
    return {
      currency: 100.0,
      buyPrice: 12.0,
      upgradePrice: 15.0,
      state: 0,
      buildingType: this.initialBuildingType,
      buildingTypes: ['base', 'buck1s', 'bucks2', 'cp01', 'cp02', 'cp03', 'cp04', 'essence', 'gold', 'shiny']
    };
  },
  methods: {
    buy() {
      if (this.currency > this.buyPrice) {
        this.state = 0;
        this.currency = this.currency - this.buyPrice;
      } else {
        this.state = 2;
      }
    },
    upgrade() {
      if (this.currency > this.upgradePrice) {
        this.state = 1;
        this.currency = this.currency - this.upgradePrice;
      } else {
        this.state = 2;
      }
    },
    handleClick() {
      if (this.state === 0) {
        this.buy();
      }
      if (this.state === 1) {
        this.upgrade();
      }
    }
  },
  computed: {
    getState() {
      if (this.state === 0) return "Buy";
      if (this.state === 1) return "Upgrade";
      if (this.state === 2) return "Not enough currency";
      return "Buy";
    },
    getBuildingType() {
      return "/images/xmas/buildings/building_" + this.buildingType + ".png";
    }
  }
};
</script>
<style>
div.construct-element {
  display: inline-block;
  overflow: hidden;
  position: relative;
  background-image: url("../../assets/xmas/buy_bg.png");
}
img.building-type {
  pointer-events: none;
  max-width: 33%;
  z-index: -1;
}
</style>
