<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

      <div class="flex flex-column flex-items-center font-size-22">
        <!-- DIVIDENDS INFO -->
        <StripedPanel class="width-90">
          <span class="title margin-top-1">Available Dividends</span>
          <StripedContent
            classes="margin-top-3 margin-bottom-3"
            contentClasses="width-100 flex flex-space-evenly"
            stripeHeight="6rem"
          >
            <IconWithValue
              iconClass="icon-trx"
              valueClass="font-size-30 font-weight-900"
              :flip="true"
            >{{totalDivs}}</IconWithValue>
          </StripedContent>

          <span class="title margin-top-1">Total DKT Staked</span>
          <StripedContent
            classes="margin-top-3 margin-bottom-3"
            contentClasses="width-100 flex flex-space-evenly"
            stripeHeight="6rem"
          >
            <IconWithValue
              iconClass="icon-trx"
              valueClass="font-size-30 font-weight-900"
              :flip="true"
            >{{totalStaked}}</IconWithValue>
          </StripedContent>

          <!-- <span class="font-size-20">Estimated dividends for you:</span>

          <StripedContent
            classes="margin-top-2 margin-bottom-5"
            contentClasses="width-100 flex flex-space-evenly"
            stripeHeight="6rem"
          >
            <IconWithValue
              iconClass="icon-trx"
              valueClass="font-size-20 font-weight-900"
              :flip="true"
            >{{estimatedDivs}}</IconWithValue>
          </StripedContent>-->

          <span class="font-size-18">Next payout in {{nextPayoutTimer.value}}</span>
        </StripedPanel>

        <!-- DIVIDENDS MANAGEMENT -->
        <div class="flex flex-center width-100 margin-top-2 flex-space-evenly">
          <Line3Element class="width-25 margin-right-half" v-if="pendingWithdrawal">
            <template v-slot:title>Withdrawn DKT</template>
            <template v-slot:value>{{pendingWithdrawal.amount}}</template>
            <template>
              <CustomButton @click="confirmWithdrawal">Confirm</CustomButton>
            </template>
          </Line3Element>

          <Line3Element class="width-25 margin-right-half" v-else>
            <template v-slot:title>Available DKT</template>
            <template v-slot:value>{{dkt}}</template>
            <template>
              <CustomButton @click="withdrawToken">Withdraw</CustomButton>
            </template>
          </Line3Element>

          <Line3Element class="width-25 margin-right-half">
            <template v-slot:title>DKT Balance</template>
            <template v-slot:value>{{dktForFreezing}}</template>
            <template>
              <CustomButton type="blue" @click="freeze">Freeze</CustomButton>
            </template>
          </Line3Element>

          <Line3Element class="width-25 margin-right-half">
            <template v-slot:title>Frozen DKT</template>
            <template v-slot:value>{{stakedDkt}}</template>
            <template>
              <CustomButton
                type="green"
                @click="unfreeze"
                :disabled="false"
                v-if="unfreezeTimer.timeLeft > 0"
              >{{unfreezeTimer.value}}</CustomButton>
              <CustomButton type="green" @click="unfreeze" v-else>Unfreeze</CustomButton>
            </template>
          </Line3Element>

          <Line3Element class="width-25 margin-top-3">
            <template v-slot:title>Available TRX</template>
            <template v-slot:value>{{estimatedDivs}}</template>
            <template>
              <CustomButton type="yellow" @click="claimDivs">Claim</CustomButton>
            </template>
          </Line3Element>
        </div>
      </div>
    </template>>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Line3Element from "./Line3Element";
import CustomButton from "@/components/Button.vue";
import Events from "@/../knightlands-shared/events";
import PromptMixin from "@/components/PromptMixin.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import Timer from "@/timer";
import { toDecimal } from "../../blockchain/utils";

export default {
  mixins: [PromptMixin, AppSection],
  components: {
    StripedPanel,
    StripedContent,
    IconWithValue,
    Line3Element,
    CustomButton,
    Promised,
    LoadingScreen
  },
  data: () => ({
    pendingWithdrawal: null,
    divsInfo: null,
    unfreezeTimer: new Timer(true),
    request: null,
    nextPayoutTimer: new Timer(true)
  }),
  created() {
    this.title = "window-dividends";
    this.nextPayoutTimer.on(
      "finished",
      this.handlePayoutTimerFinished.bind(this)
    );
  },
  async activated() {
    this.$game.on(Events.DivTokenWithdrawal, this.handleWithdrawal.bind(this));

    this.fetchDividendsInfo();
    this.pendingWithdrawal = await this.$game.fetchPendingDividendTokenWithdrawal();

    if (this.pendingWithdrawal) {
      this.nonce = this.pendingWithdrawal.nonce;
      this.signature = this.pendingWithdrawal.signature;
      this.amount = this.pendingWithdrawal.amount;
    }
  },
  deactivated() {
    this.$game.removeAllListeners(Events.DivTokenWithdrawal);
  },
  computed: {
    dkt() {
      return this.$game.dkt;
    },
    dktForFreezing() {
      if (this.divsInfo) return this.divsInfo.dkt;
      return 0;
    },
    stakedDkt() {
      if (this.divsInfo) return toDecimal(this.divsInfo.state.totalStaked, 6);
      return 0;
    },
    totalStaked() {
      if (this.divsInfo) return this.divsInfo.totalStaked;
      return 0;
    },
    estimatedDivs() {
      if (this.divsInfo) return this.divsInfo.payout;
      return 0;
    },
    totalDivs() {
      if (this.divsInfo) return this.divsInfo.totalDivs;
      return 0;
    }
  },
  methods: {
    async handlePayoutTimerFinished() {
      await this.fetchDividendsInfo();
    },
    async claimDivs() {
      try {
        this.request = this.$game.blockchainClient.claimDividends();
        await this.request;
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
    async unfreeze() {
      try {
        this.request = this.$game.blockchainClient.unfreezeDkt(0);
        await this.request;
        await this.fetchDividendsInfo();
      } catch {
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("div-token-unfreeze-failed"),
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
    async freeze() {
      try {
        this.request = this.$game.blockchainClient.freezeDkt(
          this.dktForFreezing
        );
        await this.request;
        await this.fetchDividendsInfo();
      } catch (e) {
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("div-token-freeze-failed"),
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
      this.request = this.$game.blockchainClient.fetchDividendsInfo();

      try {
        this.divsInfo = await this.request;

        this.unfreezeTimer.timeLeft =
          Number(this.divsInfo.state.depositTimestamp) +
          this.divsInfo.freezeDuration -
          this.$game.nowSec;

        const payoutPeriodDuration = this.divsInfo.payoutPeriod * 30;
        this.nextPayoutTimer.timeLeft =
          payoutPeriodDuration -
          ((this.$game.nowSec - this.divsInfo.stakingStart) %
            payoutPeriodDuration);
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