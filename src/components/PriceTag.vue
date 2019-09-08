<template>
  <IconWithValue :iconClass="dark?'icon-trx-dark':'icon-trx'" valueClass="font-size-20">{{price}}</IconWithValue>
</template>

<script>
const IAPs = require("@/iaps.json");
import Blockchains from "@/../knightlands-shared/blockchains";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["iap", "overridePrice", "dark"],
  components: { IconWithValue },
  data() {
    return {
      price: 0
    };
  },
  watch: {
    iap() {
      this.refreshPrice();
    }
  },
  mounted() {
    if (this.overridePrice) {
      switch (this.$store.state.blockchain) {
        case Blockchains.Tron:
          this.price = Math.floor((this.overridePrice / 1000000) * 100) / 100;
          break;
      }
    } else {
      this.refreshPrice();
    }
  },
  methods: {
    async refreshPrice() {
      let conversion = await this.$game.getCurrencyConversionRate();
      let iapMeta = IAPs[this.iap];
      if (iapMeta) {
        this.price = Math.floor(iapMeta.price * conversion.rate * 100) / 100;
      }
    }
  }
};
</script>


<style lang="less" scoped>
</style>

