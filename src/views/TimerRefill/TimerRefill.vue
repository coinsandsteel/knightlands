<template>
  <user-dialog :title="$t(title)" @close="$close(false)">
    <template v-slot:content>
      <Promised :promise="infoRequest">
        <template v-slot:combined="{isPending, isDelayOver}">
          <loading-screen :loading="true" v-show="isPending && isDelayOver"></loading-screen>
          <div class="flex flex-column">

            <div class="font-size-20">{{$t("refill-message")}}</div>

            <button-bar class="margin-top-2 margin-bottom-2" :sections="methods" v-model="methodChosen"></button-bar>

            <div class="flex flex-center flex-items-end refill-method-content">
              <div class="flex flex-basis-100 height-100 flex-column flex-item-center" v-show="showPayedOption">
                <!-- Native Currency -->
                <div class="flex flex-column flex-center flex-1">
                  <div class="flex flex-center margin-bottom-2 font-size-20">
                    <div>Price to restore 100% of {{stat}}:</div>
                    <PriceTag :iap="iap"></PriceTag>
                  </div>

                  <span class="flex flex-center font-size-20 margin-bottom-1">Refills today: {{refillsToday}}</span>
                  <span class="flex flex-center font-size-15 margin-bottom-1">Time until reset: {{resetTimer.value}}</span>
                </div>

                <PaymentStatus :request="refillStatusRequest" @pay="continuePurchase">
                  <PromisedButton :promise="purchasePromise" :props="{width:'16rem', type:'yellow'}" @click="confirm">{{$t("btn-confirm")}}</PromisedButton>
                </PaymentStatus>
              </div>

              <div class="flex flex-basis-100 flex-column flex-item-center" v-show="showGoldOption">
                <div class="flex flex-column flex-center flex-1">
                  <div class="flex flex-center margin-bottom-2 font-size-20">
                    <span>Price to restore 100% of {{stat}}: </span>
                    <IconWithValue iconClass="icon-gold">{{softCost}}</IconWithValue>
                  </div>
                </div>
              </div>

              <div class="flex flex-basis-100 flex-column flex-item-center" v-show="methodChosen == 1">
                <!-- Shinies -->
                <!-- <PromisedButton :promise="purchasePromise" :props="{width:'16rem', type:'yellow'}" @click="confirm">{{$t("btn-confirm")}}</PromisedButton> -->
              </div>

              <div class="flex flex-basis-100 flex-column flex-item-center" v-show="methodChosen == 2">
                <!--Items -->
                <!-- <PromisedButton :promise="purchasePromise" :props="{width:'16rem', type:'yellow'}" @click="confirm">{{$t("btn-confirm")}}</PromisedButton> -->
              </div>

              <PromisedButton v-show="!showPayedOption" :disabled="!canProcceed" :promise="purchasePromise" :props="{width:'16rem', type:'yellow'}" @click="confirm">{{$t("btn-confirm")}}</PromisedButton>
            </div>
          </div>
        </template>
      </Promised>
      
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import ButtonBar from "@/components/ButtonBar.vue";
import CharacterStats from "@/../knightlands-shared/character_stat";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PriceTag from "@/components/PriceTag.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import CharacterStat from '../../../knightlands-shared/character_stat';
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue"
const Events = require("@/../knightlands-shared/events");

const NonHealthMethods = ["pay", "shinies", "items"];
const HealthMethods = ["gold", "shinies", "items"];

export default {
  mixins: [PaymentHandler],
  props: ["stat"],
  components: { UserDialog, PromisedButton, ButtonBar, PaymentStatus, PriceTag, Promised, LoadingScreen, IconWithValue },
  data() {
    return {
      methodChosen: 0,
      methods: [],
      refillStatusRequest: null,
      infoRequest: null,
      iap: null,
      eventHandler: null,
      refillsToday: 0,
      resetTimer: new Timer(true),
      softCost: 0,
      purchasePromise: null
    };
  },
  created() {
    this.$options.paymentEvents = [Events.TimerRefilled];
    this.methods = this.stat == CharacterStats.Health ? HealthMethods : NonHealthMethods;
  },
  mounted() {
    this.fetchInfo();
    this.fetchPaymentStatus();
  },
  computed: {
    canProcceed() {
      if (this.showGoldOption) {
        return this.$game.softCurrency >= this.softCost;
      }
    },
    showGoldOption() {
      return this.methodChosen == 0 && this.stat == CharacterStat.Health;
    },
    showPayedOption() {
      return this.methodChosen == 0 && this.stat != CharacterStat.Health;
    },
    title() {
      switch (this.stat) {
        case CharacterStats.Health:
          return "health-refill-title";

        case CharacterStats.Stamina:
          return "stamina-refill-title";

        case CharacterStats.Energy:
          return "energy-refill-title";
      }
    }
  },
  methods: {
    async confirm() {
      if (this.showPayedOption) {
        this.purchasePromise = this.$game.refillTimer(this.stat, this.methodChosen);
        await this.purchaseRequest(this.purchasePromise);
      } else {
        await this.$game.refillTimer(this.stat, this.methodChosen);
        this.$close();
      }
    },
    handlePaymentComplete() {
      this.$close();
    },
    async fetchPaymentStatus() {
      this.refillStatusRequest = this.$game.fetchTimerRefillStatus(this.stat);
      await this.refillStatusRequest;
    },
    async fetchInfo() {
      this.infoRequest = this.$game.getTimerRefillInfo(this.stat);

      let info = await this.infoRequest;
      this.iap = info.iap;
      this.refillsToday = info.refills;
      this.softCost = info.soft;
      this.resetTimer.timeLeft = info.timeTillReset / 1000;
    }
  }
};
</script>

<style lang="less" scoped>
.refill-method-content {
  height: 50vh;
}
</style>


