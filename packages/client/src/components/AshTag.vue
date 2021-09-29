<template>
  <IconWithValue iconClass="icon-dkt2">{{ convertedPrice }}</IconWithValue>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import CurrencyType from "@/../../knightlands-shared/currency_type";

const THROTTLE = 30000;

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
      convertedPrice: 0,
      nextUpdate: 0,
      rate: 0
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
      if (this.nextUpdate <= this.$game.nowSec) {
        const { rate } = await this.$game.getCurrencyConversionRate(
          CurrencyType.Dkt
        );
        this.rate = rate;
        this.nextUpdate = this.$game.nowSec + THROTTLE;
      }

      this.convertedPrice = this.price / this.rate / 100;

      this.$emit("input", this.convertedPrice);
    }
  }
};
</script>
