<template>
  <UserDialog title="Refill Energy" class="font-size-22" @close="$close">
    <template v-slot:content>
      <div>
        <div class="flex flex-center flex-no-wrap">
          Refill energy
          <!-- <span
            class="flex-inline flex-items-center flex-no-wrap margin-left-half margin-right-1"
          >
            <div class="_icon-energy h-energy" />
            <span class="font-size-20">{{ energy }}</span>
          </span> -->
          <IconWithValue iconClass="icon-dkt" class="margin-left-1">{{
            price
          }}</IconWithValue>
        </div>
        <div class="flex flex-center flex-no-wrap margin-top-half">
          Your flesh balance:
          <IconWithValue iconClass="icon-dkt" class="margin-left-1">{{
            balance.flesh
          }}</IconWithValue>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <CustomButton
        type="yellow"
        :disabled="!canBuy"
        min-width="14rem"
        @click="buyHandler"
        >Buy</CustomButton
      >
      <CustomButton type="grey" min-width="14rem" @click="$close">{{
        $t("close")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  computed: {
    ...mapState({
      prices: state => state.dungeon.user.prices
    }),
    price() {
      return this.prices && this.prices.energy
        ? Math.floor(this.prices.energy * 100) / 100
        : 0;
    },
    balance() {
      return {
        // hard: this.$game.hardCurrency,
        flesh: this.$game.dkt
      };
    },
    canBuy() {
      return this.balance.flesh >= this.price;
    }
  },
  methods: {
    buyHandler() {
      this.performRequestNoCatch(
        this.$store.dispatch("dungeon/purchase", {
          type: "energy"
        })
      );
      this.$close();
    }
  }
};
</script>
