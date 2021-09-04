<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div v-bar>
      <div class="flex flex-column flex-items-center padding-top-1">
        <!-- SEASON INFO -->
        <div class="width-100 flex flex-column flex-center">
          <Title :stackBottom="true">
            <HintButton title="div-seas" :texts="['div-seas-1', 'div-seas-2']">
              {{ $t("d-season", { season }) }}
            </HintButton>
          </Title>

          <div class="color-panel-2 season-timer flex flex-center">
            <span class="font-size-22 font-weight-700">{{
              $t("d-s-f-at", { timer: seasonTimer.value })
            }}</span>
          </div>
        </div>

        <!-- PAYOUT POOL -->
        <Title :stackTop="true" :stackBottom="true">{{ $t("d-pools") }}</Title>
        <DividendsPools class="margin-top-2 margin-bottom-2" :pools="pools" />

        <!-- DIVIDENDS INFO -->
        <div class="width-100">
          <Title :stackBottom="true">{{ $t("d-total-s") }}</Title>
          <div class="color-panel-2 width-100 flex flex-column flex-center">
            <IconWithValue
              class="margin-top-1 margin-bottom-1"
              iconClass="icon-dkt"
              valueClass="font-size-30 font-weight-900"
              >{{ totalStaked }}</IconWithValue
            >

            <span class="font-size-18">{{
              $t("next-p", { timer: nextPayoutTimer.value })
            }}</span>
          </div>

          <Title :stackBottom="true" :stackTop="true">
            <HintButton title="divs-cl" :texts="['divs-cl-1', 'divs-cl-2']">
              {{ $t("d-avai-d") }}
            </HintButton></Title
          >
          <div
            class="flex flex-column flex-center color-panel-1 padding-left-2 padding-right-2"
          >
            <template v-if="hasPayouts">
              <div
                class="flex flex-space-between width-100"
                v-for="(payout, bId) in payouts"
                :key="bId"
              >
                <IconWithValue
                  :iconClass="getIcon(bId)"
                  valueClass="font-size-30 font-weight-900"
                  >{{ toDecimal(bId, payout) }}</IconWithValue
                >
                <CustomButton
                  type="yellow"
                  @click="claimDivs(bId, payout)"
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
        </div>

        <!-- DIVIDENDS MANAGEMENT -->
        <div class="user-stats width-100 margin-top-2">
          <div class="row">
            <HintButton class="hint" title="y-stake" :texts="['y-stake-1']">
              {{ $t("d-stake") }}
            </HintButton>
            <IconWithValue class="balance" iconClass="icon-dkt">{{
              stakedDkt
            }}</IconWithValue>
          </div>
          <div class="row">
            <div class="hint flex flex-center">
              <HintButton title="d-bal" :texts="['d-bal-1', 'd-bal-2']">
                {{ $t("d-balance") }}
              </HintButton>
              <AddToMetamask class="margin-left-1" :type="dktType" />
            </div>
            <IconWithValue class="balance" iconClass="icon-dkt">{{
              dkt
            }}</IconWithValue>
          </div>

          <div class="row">
            <div class="hint flex flex-center">
              <HintButton title="du-bal" :texts="['du-bal-1', 'du-bal-2']">
                {{ $t("du-balance") }}
              </HintButton>
              <AddToMetamask class="margin-left-1" :type="dkt2Type" />
            </div>

            <IconWithValue class="balance" iconClass="icon-dkt2">{{
              unlockedDkt
            }}</IconWithValue>
          </div>

          <div class="row flex">
            <CustomButton type="yellow" @click="goToStake">{{
              $t("btn-stake")
            }}</CustomButton>
            <CustomButton type="green" @click="withdrawDivs">{{
              $t("btn-withdraw-divs")
            }}</CustomButton>
          </div>

          <div class="row flex">
            <CustomButton type="blue" @click="deposit">{{
              $t("btn-deposit")
            }}</CustomButton>
            <CustomButton type="blue" @click="withdraw">{{
              $t("btn-withdraw-tokens")
            }}</CustomButton>
          </div>
        </div>
      </div>
    </div>

    <portal to="footer" v-if="isActive">
      <CustomButton type="green" @click="goTo('divs-shop')">{{
        $t("btn-shop")
      }}</CustomButton>
      <CustomButton
        type="grey"
        v-if="hasPendingWithdrawals"
        @click="goTo('history')"
        >{{ $t("btn-history") }}</CustomButton
      >
    </portal>
  </div>
</template>

<script>
import HintButton from "@/components/HintButton.vue";
import Title from "@/components/Title.vue";
import AppSection from "@/AppSection.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin.vue";
import DividendsPools from "./DividendsPools.vue";
import CustomButton from "@/components/Button.vue";
import Events from "@/../../knightlands-shared/events";
import PromptMixin from "@/components/PromptMixin.vue";
import Timer from "@/timer";
import { toDecimal } from "../../blockchain/utils";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AddToMetamask from "./AddToMetamask.vue";

export default {
  mixins: [
    PromptMixin,
    AppSection,
    BlockchainUtilsMixin,
    NetworkRequestErrorMixin
  ],
  components: {
    AddToMetamask,
    HintButton,
    IconWithValue,
    CustomButton,
    Title,
    DividendsPools
  },
  data: () => ({
    dktType: CurrencyType.Dkt,
    dkt2Type: CurrencyType.Dkt2,
    divsInfo: null,
    nextPayoutTimer: new Timer(true),
    seasonTimer: new Timer(true),
    pendingWithdrawals: [],
    season: 0
  }),
  created() {
    this.$options.loadingTimeout = 1000;
    this.title = "w-divs";
    this.nextPayoutTimer.on(
      "finished",
      this.handlePayoutTimerFinished.bind(this)
    );
  },
  activated() {
    this.init();
    this.channel = this.$game.createChannel("divs_info", false);
    this.channel.watch(divsInfo => {
      for (let key in divsInfo) {
        this.divsInfo[key] = divsInfo[key];
      }
    });
  },
  deactivated() {
    if (this.channel) {
      this.channel.destroy();
      this.channel = null;
    }
    this.$game.removeAllListeners(Events.DivTokenWithdrawal);
  },
  computed: {
    pendingWithdrawal() {
      return true;
    },
    pools() {
      if (!this.divsInfo) {
        return {};
      }

      return this.divsInfo.pools;
    },
    dkt() {
      return this.$game.inventory.getCurrency(CurrencyType.Dkt, 6);
    },
    totalStaked() {
      if (this.divsInfo) return this.divsInfo.totalStake;
      return 0;
    },
    stakedDkt() {
      return this.$game.inventory.getCurrency(CurrencyType.StakedDkt, 6);
    },
    unlockedDkt() {
      return this.$game.inventory.getCurrency(CurrencyType.Dkt2, 6);
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
      return this.pendingWithdrawals.length > 0;
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
    async claimDivs(bid, amount) {
      await this.performRequest(this.$game.claimDividends(bid));
    },
    withdrawDivs() {
      this.$router.push({ name: "divs-claim" });
    },
    async fetchDividendsInfo() {
      if (!this.isActive) {
        return;
      }

      this.divsInfo = await this.performRequestNoCatch(
        this.$game.getDivsStatus()
      );
      this.season = this.divsInfo.season.season;

      this.nextPayoutTimer.timeLeft =
        this.divsInfo.nextPayout - this.$game.nowSec;

      this.seasonTimer.timeLeft =
        this.divsInfo.season.finishAt - this.$game.nowSec;

      this.pendingWithdrawals = await this.$game.fetchWithdrawTokensStatus();
    },
    async withdraw() {
      this.$router.push({
        name: "withdrawal"
      });
    },
    async deposit() {
      this.$router.push({
        name: "deposit"
      });
    },
    async goToStake() {
      this.$router.push({ name: "stake" });
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

<style lang="less" scoped>
.season-timer {
  height: 8rem;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  padding-left: 1rem;
  padding-right: 1rem;

  & .row {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: 1fr;
    grid-column: ~"1/4";
    height: 5rem;
    justify-items: start;

    & .hint {
      grid-column: ~"2/5";
      grid-row: 1;
    }

    & .balance {
      grid-column: ~"6/9";
      grid-row: 1;
    }

    & .btn {
      // grid-column: 3;
      // grid-row: 1;
      justify-self: stretch;
    }
  }

  & .row:nth-child(1) {
    grid-row: 1;
  }

  & .row:nth-child(2) {
    grid-row: 2;
  }

  & .row:nth-child(3) {
    grid-row: 3;
  }

  & .row:nth-child(4) {
    grid-template-columns: repeat(2, 1fr);
    grid-row: 4;
  }

  & .row:nth-child(5) {
    grid-template-columns: repeat(2, 1fr);
    grid-row: 5;
  }
}
</style>
