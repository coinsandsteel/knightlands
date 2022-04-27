<template>
  <span class="margin-left-1 margin-right-1">{{ price / 100 }}$ </span>
</template>

<script>
const IAPs = require("@/metadata/iaps.json");

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
    this.refreshPrice();
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
