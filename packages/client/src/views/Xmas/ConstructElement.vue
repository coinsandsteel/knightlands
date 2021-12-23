<template>
  <div class="flex flex-column flex-center">
    <div class="padding-1 price-l">
      <IconWithValue iconClass="icon-gold">10.0</IconWithValue>
    </div>
    <PurchaseButton
      type="grey"
      class="margin-top-1 margin-bottom-1"
      @click="$emit('purchase')"
      minWidth="15rem"
      :price="10.0"
    >{{getState}}
    </PurchaseButton>
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
import PurchaseButton from "@/components/PurchaseButton.vue";

export default {
  components: {
    IconWithValue,
    PurchaseButton
  },
  data() {
    return {
      currency: 100.0,
      buyPrice: 12.0,
      upgradePrice: 15.0,
      state: 0
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
    }
  },
  computed: {
    getState() {
      if (this.state === 0) return "Buy";
      if (this.state === 1) return "Upgrade";
      if (this.state === 2) return "Not enough currency";
      return "Buy";
    }
  }
};
</script>
