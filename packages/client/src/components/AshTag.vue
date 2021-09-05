<template>
  <IconWithValue iconClass="icon-dkt2">{{ convertedPrice }}</IconWithValue>
</template>

<script>
import { toDecimal } from "@/blockchain/utils";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: {
    price: Number,
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
      convertedPrice: 0
    };
  },
  watch: {
    price() {
      this.refreshPrice();
    }
  },
  mounted() {
    this.refreshPrice();
  },
  methods: {
    async refreshPrice() {
      const { rate } = await this.$game.getCurrencyConversionRate();
      this.convertedPrice = toDecimal(
        ((this.price * rate) / 100) * Math.pow(10, 6),
        6
      );
      this.$emit("input", this.convertedPrice);
    }
  }
};
</script>
