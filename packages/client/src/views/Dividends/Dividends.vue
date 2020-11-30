<template>
  <div class="screen-content padding-top-2">
    <div class="screen-background"></div>

    <div v-bar>
      <div class="flex flex-column flex-items-center">
        <!-- DIVIDENDS INFO -->
        <div class="width-100">
          <Title :stackBottom="true" class="margin-top-1"
            >Available Dividends</Title
          >
          <div class="flex flex-column flex-center color-panel-1">
            <template v-if="hasPayouts">
              <div
                class="flex flex-center"
                v-for="(payout, bId) in payouts"
                :key="bId"
              >
                <IconWithValue
                  :iconClass="getIcon(bId)"
                  valueClass="font-size-30 font-weight-900"
                  :flip="true"
                  >{{ toDecimal(bId, payout) }}</IconWithValue
                >
                <CustomButton
                  type="yellow"
                  @click="claimDivs(bId)"
                  :disabled="!canClaim(bId)"
                  >{{ $t("btn-claim") }}</CustomButton
                >
              </div>
            </template>
            <template v-else>
              <span
                class="grey-title font-size-20 margin-top-1 margin-bottom-1"
                >{{ $t("w-no-divs") }}</span
              >
            </template>
          </div>

          <Title :stackTop="true" :stackBottom="true">Total DKT Staked</Title>
          <div class="color-panel-2 width-100 flex flex-column flex-center">
            <IconWithValue
              class="margin-top-1 margin-bottom-1"
              iconClass="icon-dkt"
              valueClass="font-size-30 font-weight-900"
              :flip="true"
              >{{ totalStaked }}</IconWithValue
            >

            <span class="font-size-18"
              >Next payout in {{ nextPayoutTimer.value }}</span
            >
          </div>
        </div>

        <!-- DIVIDENDS MANAGEMENT -->
        <div class="flex flex-center width-100 margin-top-2 flex-space-evenly">
          <!-- <Line3Element
            class="width-25 margin-right-half"
            v-if="pendingWithdrawal"
          >
            <template v-slot:title>Withdrawn DKT</template>
            <template v-slot:value>{{ pendingWithdrawal.amount }}</template>
            <template>
              <CustomButton @click="confirmWithdrawal">Confirm</CustomButton>
            </template>
          </Line3Element> -->

          <Line3Element class="width-25 margin-right-half">
            <template v-slot:title>Your stake</template>
            <template v-slot:value>
              <IconWithValue iconClass="icon-dkt" :flip="true">{{
                dkt
              }}</IconWithValue>
            </template>
          </Line3Element>

          <Line3Element class="width-25 margin-right-half">
            <template v-slot:title>Your Balance</template>
            <template v-slot:value
              ><IconWithValue iconClass="icon-dkt" :flip="true">{{
                unlockedDkt
              }}</IconWithValue></template
            >
          </Line3Element>
        </div>
      </div>
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton
        type="grey"
        v-if="hasPendingWithdrawals"
        @click="goTo('divs-withdrawals')"
        >{{ $t("btn-pend-divs") }}</CustomButton
      >
    </portal>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import AppSection from "@/AppSection.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin";
import Line3Element from "./Line3Element";
import CustomButton from "@/components/Button.vue";
import Events from "@/../../knightlands-shared/events";
import PromptMixin from "@/components/PromptMixin.vue";
import Timer from "@/timer";
import { toDecimal } from "../../blockchain/utils";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [
    PromptMixin,
    AppSection,
    BlockchainUtilsMixin,
    NetworkRequestErrorMixin
  ],
  components: {
    IconWithValue,
    CustomButton,
    Title,
    Line3Element
  },
  data: () => ({
    divsInfo: null,
    request: null,
    nextPayoutTimer: new Timer(true)
  }),
  created() {
    this.title = "w-divs";
    this.nextPayoutTimer.on(
      "finished",
      this.handlePayoutTimerFinished.bind(this)
    );
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.$game.removeAllListeners(Events.DivTokenWithdrawal);
  },
  computed: {
    dkt() {
      return this.$game.inventory.getCurrency(CurrencyType.Dkt, 8);
    },
    totalStaked() {
      if (this.divsInfo) return this.divsInfo.supply;
      return 0;
    },
    unlockedDkt() {
      if (this.divsInfo) return this.$game.dividends.unlockedTokens;
      return 0;
    },
    payouts() {
      return this.$game.dividends.payouts;
    },
    hasPayouts() {
      for (const id in this.payouts) {
        if (this.canClaim(id)) {
          return true;
        }
      }
      return false;
    },
    hasPendingWithdrawals() {
      if (this.divsInfo) {
        return this.divsInfo.pendingDivs.length > 0;
      }

      return false;
    }
  },
  methods: {
    async init() {
      this.$game.on(
        Events.DivTokenWithdrawal,
        this.handleWithdrawal.bind(this)
      );

      this.fetchDividendsInfo();
    },
    goTo(name) {
      this.$router.push({ name });
    },
    async handlePayoutTimerFinished() {
      await this.fetchDividendsInfo();
    },
    canClaim(bId) {
      if (typeof this.payouts[bId] === "string") {
        return this.payouts[bId] !== "0";
      }
      return this.payouts[bId];
    },
    async claimDivs(bid) {
      try {
        await this.performRequestNoCatch(this.$game.claimDividends(bid));
        await this.fetchDividendsInfo();
      } catch {
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("div-claim-failed"),
          [
            {
              type: "red",
              title: "btn-ok",
              response: true
            }
          ]
        );
      }
    },
    async fetchDividendsInfo() {
      this.request = this.$game.getDivsStatus();

      try {
        this.divsInfo = await this.request;

        this.nextPayoutTimer.timeLeft =
          this.divsInfo.nextPayout - this.$game.nowSec;
      } catch {
        // possible stack overflow
        await this.fetchDividendsInfo();
      }
    },
    async withdrawToken() {
      this.request = this.$game.requestDividendTokenWithdrawal(this.dkt);
      const { nonce, signature, amount } = await this.request;

      this.nonce = nonce;
      this.signature = signature;
      this.amount = amount;

      await this.confirmWithdrawal();
    },
    async confirmWithdrawal() {
      this.request = this.$game.sendDividendTokenWithdrawal(
        this.amount,
        this.nonce,
        this.signature
      );
      await this.request;
    },
    handleWithdrawal(data) {
      if (data.success) {
        this.fetchDividendsInfo();

        this.showPrompt(
          this.$t("prompt-success-title"),
          this.$t("div-token-withdrawal-success", {
            amount: toDecimal(this.amount, 6)
          }),
          [
            {
              type: "yellow",
              title: "btn-ok",
              response: true
            }
          ]
        );

        this.amount = 0;
      } else {
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("div-token-withdrawal-failed"),
          [
            {
              type: "red",
              title: "btn-ok",
              response: true
            }
          ]
        );
      }
    }
  }
};
</script>
