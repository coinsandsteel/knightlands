<template>
  <div class="screen-content font-size-25">
    <div class="screen-background"></div>

    <div v-bar>
      <div class="flex flex-column flex-items-center padding-top-1">
        <div class="color-panel-1 margin-bottom-4">
          <IconWithValue
            :flip="true"
            iconClass="icon-dkt"
            class="margin-right-1"
            >{{ emission }}</IconWithValue
          >

          <span class="font-size-22">{{
            $t("time-till-rp", { time: nextPayout.value })
          }}</span>
        </div>

        <div class="score-stats">
          <div class="row">
            <span>
              {{ $t("rp-d-bb") }}
            </span>
            <IconWithValue iconClass="icon-dkt">
              <div class="flex flex-center">
                <span>{{ dktValue }}</span>
              </div>
            </IconWithValue>
          </div>

          <div class="row">
            <span>
              {{ $t("rp-d-b") }}
            </span>
            <IconWithValue iconClass="icon-dkt">
              <div class="flex flex-center">
                <span>{{ dkt }}</span>
                <AddToMetamask class="margin-left-1" type="dkt" />
              </div>
            </IconWithValue>
          </div>

          <div class="row">
            <span>
              {{ $t("ex-dkt") }}
            </span>
            <IconWithValue iconClass="icon-dkt">{{
              expectedDkt
            }}</IconWithValue>
          </div>

          <div class="row">
            <span>
              {{ $t("rp-score") }}
            </span>
            <IconWithValue iconClass="icon-rp">{{ score }}</IconWithValue>
          </div>

          <div class="row">
            <span>
              {{ $t("rp-s-total") }}
            </span>
            <IconWithValue iconClass="icon-rp">{{
              totalPointsUI
            }}</IconWithValue>
          </div>
        </div>

        <div class="color-panel-2">
          <HintButton title="d-bal" :texts="['d-bal-1', 'd-bal-2']">
            <span v-if="isFreeAccount">{{ $t("acc-free") }}</span>
            <span v-else>{{ $t("acc-norm") }}</span>
          </HintButton>
        </div>

        <div class="flex flex-center margin-top-2" v-if="isFreeAccount">
          <CustomButton @click="upgradeAccount">{{
            $t("cnrt-normal")
          }}</CustomButton>
        </div>
        <div class="flex flex-center margin-top-2" v-else>
          <CustomButton @click="upgradeAccount">{{
            $t("cnrt-free")
          }}</CustomButton>
        </div>

        <div
          class="color-panel-1 margin-top-4 flex flex-column padding-left-1 padding-right-1"
        >
          <span>{{ $t("rp-desc") }}</span>
        </div>

        <!-- PAYOUT POOL -->
        <!-- <Title :stackTop="true" :stackBottom="true">{{ $t("d-pools") }}</Title>
        <DividendsPools class="margin-top-2 margin-bottom-2" :pools="pools" /> -->

        <!-- DIVIDENDS INFO -->
        <!-- <div class="width-100">
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
        </div> -->

        <!-- DIVIDENDS MANAGEMENT -->
        <div class="user-stats width-100 margin-top-2">
          <!-- <div class="row">
            <div class="hint flex flex-center">
              <HintButton title="d-bal" :texts="['d-bal-1', 'd-bal-2']">
                {{ $t("d-balance") }}
              </HintButton>
              <AddToMetamask class="margin-left-1" :type="dktType" />
            </div>
            <IconWithValue class="balance" iconClass="icon-dkt">{{
              dkt
            }}</IconWithValue>
          </div> -->

          <!-- <div class="row flex">
            <CustomButton type="blue" @click="deposit">
              <IconWithValue iconClass="icon-dkt">{{
                $t("btn-deposit")
              }}</IconWithValue>
            </CustomButton>
            <CustomButton type="yellow" @click="withdraw">
              <IconWithValue iconClass="icon-dkt">{{
                $t("btn-withdraw")
              }}</IconWithValue>
            </CustomButton>
          </div> -->
        </div>

        <div class="flex flex-center margin-top-5">
          <CustomButton
            type="yellow"
            @click="goToPresalePacks"
            minWidth="20rem"
            >{{ $t("d-presale") }}</CustomButton
          >
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
import AppSection from "@/AppSection.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import BlockchainUtilsMixin from "./BlockchainUtilsMixin.vue";
import CustomButton from "@/components/Button.vue";
import Events from "@/../../knightlands-shared/events";
import PromptMixin from "@/components/PromptMixin.vue";
import Timer from "@/timer";
import { toDecimal } from "../../blockchain/utils";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AddToMetamask from "./AddToMetamask.vue";

const PAYOUT_PERIOD = 86400;
const FLESH_EMISSION = 1000;
const FREE_FLESH_EMISSION = 35;
const PRECISION = 10000;
const FLASH_PRECISION = 1000000;

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
    CustomButton
  },
  data: () => ({
    dktType: CurrencyType.Dkt,
    dkt2Type: CurrencyType.Dkt,
    divsInfo: null,
    pendingWithdrawals: [],
    nextPayoutTimer: new Timer(true),
    nextPayout: new Timer(true),
    totalShares: 0,
    totalPoints: 0,
    fleshRate: 1
  }),
  created() {
    this.$options.loadingTimeout = 1000;
    this.title = "w-divs";
  },
  activated() {
    this.init();
  },
  deactivated() {
    if (this.channel) {
      this.channel.destroy();
      this.channel = null;
    }

    if (this.divs_channel) {
      this.divs_channel.destroy();
      this.divs_channel = null;
    }
    this.$game.removeAllListeners(Events.DivTokenWithdrawal);
  },
  computed: {
    dktValue() {
      return this.dkt * this.fleshRate;
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
      return this.$game.inventory.getCurrency(CurrencyType.Dkt, 6);
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
    },
    isFreeAccount() {
      return this.$game.isFreeAccount;
    },
    emission() {
      return this.$game.isFreeAccount ? FREE_FLESH_EMISSION : FLESH_EMISSION;
    },
    score() {
      return Math.floor(this.$game.raidPoints.score * PRECISION) / PRECISION;
    },
    totalSharesUI() {
      return Math.floor(this.totalShares * PRECISION) / PRECISION;
    },
    totalPointsUI() {
      return Math.floor(this.totalPoints * PRECISION) / PRECISION;
    },
    expectedDkt() {
      if (this.totalShares == 0) {
        return 0;
      }
      return (
        Math.floor(
          (this.$game.raidPoints.shares / this.totalShares) *
            this.emission *
            FLASH_PRECISION
        ) / FLASH_PRECISION
      );
    },
    shares() {
      return Math.floor(this.$game.raidPoints.shares * PRECISION) / PRECISION;
    }
  },
  methods: {
    goToPresalePacks() {
      this.$router.push({ name: "presale" });
    },
    async init() {
      this.channel = this.$game.createChannel("total_rp", false);
      this.channel.watch(this.updateShares.bind(this));

      this.divs_channel = this.$game.createChannel("divs_info", false);
      this.divs_channel.watch(divsInfo => {
        for (let key in divsInfo) {
          this.divsInfo[key] = divsInfo[key];
        }
      });

      this.$game.on(
        Events.DivTokenWithdrawal,
        this.handleWithdrawal.bind(this)
      );

      this.fetchDividendsInfo();

      const nextPayout = this.$game.raidPoints.lastClaimed + PAYOUT_PERIOD;
      this.nextPayout.timeLeft = nextPayout - this.$game.nowSec;

      const info = await this.performRequest(this.$game.fetchRaidPointsInfo());
      this.updateShares(info, this.isFreeAccount);

      const { rate } = await this.$game.getCurrencyConversionRate(
        CurrencyType.Dkt
      );
      this.fleshRate = rate;
    },
    updateShares(data, isFree) {
      if (isFree) {
        this.totalShares = data.totalFreeShares;
        this.totalPoints = data.totalFreePoints;
      } else {
        this.totalShares = data.totalShares;
        this.totalPoints = data.totalPoints;
      }
    },
    async upgradeAccount() {
      // Check any free raids started
      let raidsList = await this.performRequest(this.$game.fetchCurrentRaids());
      let activeRaidsCount = raidsList.filter(raid => !raid.finished).length;

      // Forbid account type changing due to any unfinished raids
      if (activeRaidsCount) {
        await this.showPrompt(
          this.$t("acc-upgrade-err-t"),
          this.$t("acc-upgrade-err-m"),
          [
            {
              type: "grey",
              title: this.$t("acc-upgrade-err-a"),
              response: true
            }
          ]
        );
        return;
      }

      const free = this.isFreeAccount;
      const response = await this.showPrompt(
        this.$t("acc-u-t"),
        free ? this.$t("acc-u-d") : this.$t("acc-u-d2"),
        [
          {
            type: "grey",
            title: this.$t("co-acc-u"),
            response: true
          },
          {
            type: "red",
            title: this.$t("c-acc-u"),
            response: false
          }
        ]
      );

      if (response === true) {
        await this.performRequest(this.$game.upgradeAccount());
        const info = await this.performRequest(
          this.$game.fetchRaidPointsInfo()
        );
        this.updateShares(info, !free);
      }
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
      this.nextPayoutTimer.timeLeft =
        this.divsInfo.nextPayout - this.$game.nowSec;

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
    grid-template-columns: repeat(2, 1fr);
    grid-row: 1;
  }
}

.score-stats {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  padding-left: 1rem;
  padding-right: 1rem;

  & .row {
    display: grid;
    grid-template-columns: 1fr 4rem 1fr;
    grid-template-rows: 1fr;
    margin-bottom: 1rem;

    & :nth-child(1) {
      grid-column: 1;
      text-align: right;
      grid-row: 1;
    }

    & :nth-child(2) {
      grid-row: 1;
      grid-column: 3;
    }

    & :nth-child(3) {
      grid-row: 1;
      grid-column: 3;
    }
  }
}
</style>
