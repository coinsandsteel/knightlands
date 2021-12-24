<template>
  <div class="flex flex-column flex-center construct-element">
    <img :src="getBuildingType" />

    <CustomButton
      class="margin-top-1 margin-bottom-1"
      type="grey"
      minWidth="15rem"
      @click="handleClick"
    >
      <div class="price-l">
        {{ getState }}
        <IconWithValue iconClass="icon-premium">100</IconWithValue>
      </div>
    </CustomButton>
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
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";

export default {
  props: ["initialBuildingType"],
  components: {
    CustomButton,
    IconWithValue
  },
  data() {
    return {
      currency: 100.0,
      buyPrice: 12.0,
      upgradePrice: 15.0,
      state: 0,
      buildingType: this.initialBuildingType
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
      return "/images/xmas/buildings/building" + this.buildingType + ".png";
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
  margin: 1rem;
}
img.building-type {
  pointer-events: none;
  max-width: 33%;
  z-index: -1;
}
</style>
