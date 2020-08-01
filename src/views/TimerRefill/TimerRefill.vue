<template>
  <user-dialog :title="$t(title)" @close="$close(false)" :disableScroll="true">
    <template v-slot:content>
      <Promised :promise="infoRequest">
        <template v-slot:combined="{ isPending, isDelayOver }">
          <loading-screen :loading="isPending && isDelayOver"></loading-screen>
          <div class="flex flex-column">
            <div class="font-size-20">{{ $t("refill-message") }}</div>

            <button-bar
              class="margin-top-2 margin-bottom-2"
              :sections="methods"
              v-model="methodChosen"
            ></button-bar>

            <div class="flex flex-center flex-no-wrap flex-column flex-end refill-method-content">
              <keep-alive>
                <div
                  class="flex flex-basis-100 height-100 flex-column flex-item-center"
                  v-if="showPayedOption"
                >
                  <!-- Native Currency -->
                  <div class="flex flex-column flex-center flex-1">
                    <div class="flex flex-center margin-bottom-2 font-size-20">
                      <div>Price to restore 100% of {{ $t(stat) }}:</div>
                      <PriceTag :iap="iap"></PriceTag>
                    </div>

                    <span
                      class="flex flex-center font-size-20 margin-bottom-1"
                    >Refills today: {{ refillsToday }}</span>
                    <span
                      class="flex flex-center font-size-18 margin-bottom-1"
                    >Time until reset: {{ resetTimer.value }}</span>
                  </div>

                  <PaymentStatus :request="refillStatusRequest" @pay="continuePurchase">
                    <PromisedButton
                      :promise="purchasePromise"
                      width="16rem"
                      type="yellow"
                      @click="confirm"
                    >{{ $t("btn-confirm") }}</PromisedButton>
                  </PaymentStatus>
                </div>
              </keep-alive>

              <keep-alive>
                <div class="flex flex-basis-100 flex-column flex-item-center" v-if="showGoldOption">
                  <div class="flex flex-column flex-center flex-1">
                    <div class="flex flex-center margin-bottom-2 font-size-20">
                      <span>Price to restore 100% of {{ stat }}:</span>
                      <IconWithValue iconClass="icon-gold">
                        {{
                        softCost
                        }}
                      </IconWithValue>
                    </div>
                  </div>
                </div>
              </keep-alive>

              <keep-alive>
                <div
                  class="flex flex-basis-100 flex-column flex-item-center"
                  v-if="methodChosen == 1 && !isHealth"
                >
                  <!-- Shinies -->
                  <div class="flex flex-basis-100 height-100 flex-column flex-item-center">
                    <!-- Native Currency -->
                    <div class="flex flex-column flex-center flex-1">
                      <div class="flex flex-center margin-bottom-2 font-size-20">
                        <div>Price to restore 100% of {{ stat }}:</div>
                        <IconWithValue iconClass="icon-premium">
                          {{
                          hardCost
                          }}
                        </IconWithValue>
                      </div>

                      <span
                        class="flex flex-center font-size-20 margin-bottom-1"
                      >Refills today: {{ refillsToday }}</span>
                      <span
                        class="flex flex-center font-size-18 margin-bottom-1"
                      >Time until reset: {{ resetTimer.value }}</span>
                    </div>
                  </div>
                </div>
              </keep-alive>

              <keep-alive>
                <div
                  class="flex width-100 height-100 flex-column flex-item-center"
                  v-if="(methodChosen == 1 && isHealth) || methodChosen == 2"
                >
                  <!--Items -->
                  <RefillWithItems @canProceed="itemStateChanged" :stat="stat"></RefillWithItems>
                </div>
              </keep-alive>

              <div class="flex">
                <PromisedButton
                  v-show="!showPayedOption"
                  :disabled="!canProcceed"
                  :promise="purchasePromise"
                  width="16rem"
                  type="yellow"
                  @click="confirm"
                >{{ $t("btn-confirm") }}</PromisedButton>
              </div>
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
import CharacterStat from "../../../knightlands-shared/character_stat";
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue";
import RefillWithItems from "./RefillWithItems.vue";
const Events = require("@/../knightlands-shared/events");

const NonHealthMethods = ["pay", "shinies", "items"];
const HealthMethods = ["gold", "items"];

export default {
  mixins: [PaymentHandler],
  props: ["stat"],
  components: {
    UserDialog,
    PromisedButton,
    ButtonBar,
    PaymentStatus,
    PriceTag,
    Promised,
    LoadingScreen,
    IconWithValue,
    RefillWithItems
  },
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
      purchasePromise: null,
      canBeConfirmed: false,
      items: null
    };
  },
  created() {
    this.$options.paymentEvents = [Events.TimerRefilled];
    this.methods =
      this.stat == CharacterStats.Health ? HealthMethods : NonHealthMethods;
  },
  mounted() {
    this.fetchInfo();
    this.fetchPaymentStatus();
  },
  watch: {
    methodChosen() {
      this.canBeConfirmed = false;

      if (this.methodChosen == 1) {
        this.canBeConfirmed = this.hardCost <= this.$game.hardCurrency;
      }
    }
  },
  computed: {
    canProcceed() {
      if (this.showGoldOption) {
        return this.$game.softCurrency >= this.softCost;
      }

      return this.canBeConfirmed;
    },
    isHealth() {
      return this.stat == CharacterStat.Health;
    },
    showGoldOption() {
      return this.methodChosen == 0 && this.isHealth;
    },
    showPayedOption() {
      return this.methodChosen == 0 && !this.isHealth;
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

      return "";
    }
  },
  methods: {
    itemStateChanged(canProceed, items) {
      this.items = items;
      this.canBeConfirmed = canProceed;
    },
    async confirm() {
      if (this.showPayedOption) {
        this.purchasePromise = this.$game.refillTimer(
          this.stat,
          this.methodChosen
        );
        await this.purchaseRequest(this.purchasePromise);
      } else {
        let method = this.methodChosen;
        if (this.isHealth && method == 1) {
          method = 2;
        }
        await this.$game.refillTimer(this.stat, method, this.items);
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
      this.hardCost = info.hard;
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
