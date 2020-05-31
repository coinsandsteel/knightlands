<template>
  <UserDialog @close="$close(false)">
    <template v-slot:content>
      <Title v-if="summonType == ArmySummonType.Normal">{{$t("basic-summon")}}</Title>
      <Title v-else>{{$t("advanced-summon")}}</Title>

      <PromisedButton v-if="hasTicket" class="margin-top-1" type="yellow" @click="batchSummon">
        <span v-html="$t('unit-summon-item', {count: batchSize, icon: ticketIcon})"></span>
      </PromisedButton>

      <div class="flex flex-column" v-else-if="info.meta.iaps.length > 0">
        <PromisedButton
          v-for="iap in info.meta.iaps"
          :key="iap.iap"
          class="margin-top-1"
          type="yellow"
          @click="batchSummon"
        >
          <span>{{$t('unit-summon', { count: iap.count })}}</span>
        </PromisedButton>
      </div>

      <PaymentStatus
        ref="status"
        :request="fetchPayment"
        @pay="continuePurchase"
        v-else-if="info.meta.iaps.length > 0"
      >
        <div class="flex flex-center flex-items-end flex-column">
          <span
            class="font-size-18 margin-bottom-half"
            v-show="timer.timeLeft > 0"
          >{{$t("free-chest-timer", {timer: timer.value})}}</span>

          <PromisedButton
            v-for="iap in info.meta.iaps"
            :key="iap.iap"
            :promise="request"
            :forceLoading="pending"
            type="yellow"
            @click="purchaseSummon(iap.iap)"
            class="margin-bottom-1"
          >
            <div class="flex flex-items-center">
              <span>{{$t('btn-open')}}</span>
              <span v-if="iap.count > 1" class="margin-left-half margin-right-half">x{{iap.count}}</span>
              <PriceTag :dark="true" :iap="iap.iap" :flip="false"></PriceTag>
            </div>
          </PromisedButton>
        </div>
      </PaymentStatus>
    </template>
  </UserDialog>
</template>

<script>
import ArmySummonType from "@/../knightlands-shared/army_summon_type";
import UserDialog from "@/components/UserDialog.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PriceTag from "@/components/PriceTag.vue";
import Title from "@/components/Title.vue";

export default {
  props: ["info", "summonType"],
  mixins: [PaymentHandler],
  components: { UserDialog, PromisedButton, PaymentStatus, PriceTag, Title },
  data: () => ({
    request: null,
    ArmySummonType
  }),
  computed: {
    totalTickets() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.info.meta.ticketItem
      );
    },
    hasTicket() {
      return this.totalTickets > 0;
    },
    batchSize() {
      return this.totalTickets > 10 ? 10 : this.totalTickets;
    },
    ticketIcon() {
      return `background-image: url(${this.$game.itemsDB.getIcon(
        this.info.meta.ticketItem
      )});`;
    }
  },
  methods: {
    async fetchPaymentStatus() {
      if (this.info.meta.iaps.length > 0) {
        this.fetchPayment = this.$game.fetchArmySummonStatus();
        await this.fetchPayment;
        if (this.$refs.status && this.$refs.status.pending) {
          this.$emit("wait");
        }
      }
    },
    async batchSummon() {},
    async singleSummon() {},
    async purchaseSummon(iap) {
      this.request = this.$game.summonUnits(iap, this.summonType);
      this.purchaseRequest(this.request);
    }
  }
};
</script>
