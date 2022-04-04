<template>
  <div v-bar>
    <div class="flex flex-column flex-items-center relative">
      <img class="home-art" src="../../assets/backgrounds/goldExchange.png" />

      <div class="panel padding-1 width-100" v-if="exchange && levelMeta">
        <div class="flex flex-center flex-no-wrap width-100 margin-bottom-1">
          <!-- <span class="font-size-20">{{$t("gold-exchange-exp")}}</span> -->
          <span
            class="font-size-20 white-space-no-wrap margin-right-1"
          >{{$t("gld-exchange-level", {level: exchange.level})}}</span>
          <ProgressBar v-model="exchange.exp" :maxValue="levelMeta.expRequired"></ProgressBar>
        </div>

        <div class="flex flex-column flex-center margin-bottom-2">
          <span
            class="font-size-20 margin-top-1 title margin-bottom-1"
          >{{$t("prem-gld-exchange-boost")}}</span>

          <PaymentStatus
            :request="paymentStatusRequest"
            :cancel="true"
            @pay="continuePurchase"
            @cancel="cancelPurchase"
            class="width-80"
          >
            <div class="flex flex-column">
              <PromisedButton
                :promise="request"
                type="green"
                v-for="e in exchangeMeta.iaps"
                :key="e.iap"
                @click="premiumBoost(e.count)"
              >
                <div class="flex">
                  <PriceTag :dark="true" :iap="e.iap"></PriceTag>
                  <IconWithValue iconClass="icon-exp">{{e.count * exchangeMeta.expPerPremiumBoost}}</IconWithValue>
                </div>
              </PromisedButton>
            </div>
          </PaymentStatus>
        </div>

        <div class="flex flex-center flex-space-around width-100">
          <span
            class="font-size-20 flex-basis-50"
          >{{$t("gld-exchange-boosts-left", {count: freeBoostsLeft})}}</span>

          <PromisedButton
            :promise="request"
            type="yellow"
            @click="freeBoost"
            :disabled="freeBoostsLeft <= 0"
          >
            <div class="flex">
              <span>{{$t("gld-exchange-boost")}}</span>
              <IconWithValue iconClass="icon-exp">{{exchangeMeta.expPerBoost}}</IconWithValue>
            </div>
          </PromisedButton>
        </div>

        <div class="flex width-100 flex-column">
          <div class="flex flex-center flex-space-around width-100">
            <span
              class="font-size-20 flex-basis-50"
            >{{$t("gld-exchange-obtain-prg", {count: obtainsLeft})}}</span>
            <PromisedButton
              :promise="request"
              :disabled="obtainsLeft <= 0"
              type="yellow"
              @click="obtainGold"
            >
              <div class="flex">
                <span>{{$t("gld-exchange-obtain")}}</span>
                <IconWithValue iconClass="icon-gold">{{levelMeta.currentLevelMeta.obtainedGold}}</IconWithValue>
              </div>
            </PromisedButton>
          </div>
        </div>

        <div class="font-size-18 margin-top-2">{{$t("time-till-refill", {time: timer.value})}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import AppSection from "@/AppSection.vue";
import GoldExchangeMeta from "@/metadata/goldExchange";
import PriceTag from "@/components/PriceTag.vue";
import IconWithValue from "@/components/IconWithValue.vue";
const Events = require("@/../../knightlands-shared/events");
import Timer from "@/timer";

export default {
  name: "gold-exchange",
  mixins: [AppSection, PaymentHandler],
  components: {
    ProgressBar,
    PromisedButton,
    PriceTag,
    IconWithValue,
    PaymentStatus
  },
  data: () => ({
    exchange: null,
    levelMeta: null,
    request: null,
    paymentStatusRequest: null,
    exchangeMeta: GoldExchangeMeta,
    timer: new Timer(true)
  }),
  created() {
    this.$options.paymentEvents = [Events.GoldExchangeBoostPurchased];
  },
  mounted() {
    this.title = "window-gold-exchange";
    this.exchange = this.$game.getGoldExchange();
    this.fetchLevelMeta();
    this.fetchPaymentStatus();
  },
  computed: {
    obtainsLeft() {
      if (!this.exchange) {
        return;
      }
      return GoldExchangeMeta.freeExchanges - this.exchange.freeObtains;
    },
    freeBoostsLeft() {
      if (!this.exchange) {
        return;
      }
      return GoldExchangeMeta.freeBoosts - this.exchange.freeBoosts;
    }
  },
  methods: {
    async fetchLevelMeta() {
      this.levelMeta = await this.$game.getGoldExchangeMeta();

      this.timer.timeLeft = Math.floor(this.$game.now % 86400000) / 1000;
    },
    freeBoost() {
      this.request = this.$game.boostGoldExchange();
    },
    premiumBoost(count) {
      this.request = this.purchaseRequest(
        this.$game.premiumBoostGoldExchange(count)
      );
    },
    obtainGold() {
      this.request = this.$game.obtainGoldFromGoldExchange();
    },
    async fetchPaymentStatus() {
      this.paymentStatusRequest = this.$game.fetchGoldExchangeBoostPremiumStatus();
    }
  }
};
</script>

<style lang="less" scoped>
.home-art {
  width: 100%;
  max-height: 50vh;
  z-index: 0;
}
</style>
