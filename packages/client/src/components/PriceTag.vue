<template>
  <span class="margin-left-1 margin-right-1">{{ price / 100 }}$ </span>
</template>

<script>
const IAPs = require("@/iaps.json");
import Blockchains from "@/../../knightlands-shared/blockchains";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: {
    iap: String,
    overridePrice: Number,
    dark: Boolean,
    flip: Boolean,
    valueClass: {
      type: String,
      default: "font-size-20"
    }
  },
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
      let iapMeta = IAPs[this.iap];
      if (iapMeta) {
        this.price = iapMeta.price;
      }
    }
  }
};
</script>
