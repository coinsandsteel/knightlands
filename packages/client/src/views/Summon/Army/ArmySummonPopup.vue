<template>
  <UserDialog @close="$close(false)" :disableScroll="true">
    <template v-slot:content>
      <Title v-if="summonType == ArmySummonType.Normal">{{$t("basic-summon")}}</Title>
      <Title v-else>{{$t("advanced-summon")}}</Title>

      <span class="font-size-20"></span>

      <FreeSummon :info="info"></FreeSummon>

      <div class="width-70 center">
        <template v-if="hasTicket">
          <PromisedButton class="margin-top-1" type="yellow" @click="singleSummon">
            <div
              class="flex flex-center"
              v-html="$t('unit-summon-item', {count: 1, icon: ticketIcon})"
            ></div>
          </PromisedButton>

          <PromisedButton
            class="margin-top-1"
            type="yellow"
            @click="batchSummon"
            v-if="batchSize > 1"
          >
            <div
              class="flex flex-center flex-no-wrap"
              v-html="$t('unit-summon-item', {count: batchSize, icon: ticketIcon})"
            ></div>
          </PromisedButton>
        </template>

        <!-- <div class="flex flex-column" v-if="info.meta.iaps.length > 0">
        <PromisedButton
          v-for="iap in info.meta.iaps"
          :key="iap.iap"
          class="margin-top-1"
          type="yellow"
          @click="batchSummon"
        >
          <div class="flex flex-center">
            <span>{{$t('unit-summon', { count: iap.count })}}</span>
            <PriceTag :dark="true" :iap="iap.iap" />
          </div>
        </PromisedButton>
        </div>-->

        <PaymentStatus
          ref="status"
          :request="fetchRequest"
          @pay="continuePurchase"
          v-if="info.meta.iaps.length > 0"
          class="margin-top-1"
        >
          <div class="flex flex-column width-100">
            <PromisedButton
              v-for="iap in info.meta.iaps"
              :key="iap.iap"
              class="margin-bottom-1"
              type="yellow"
              @click="purchaseSummon(iap.iap)"
            >
              <div class="flex flex-center flex-no-wrap">
                <span>{{$t('unit-summon', { count: iap.count })}}</span>
                <PriceTag :dark="true" :iap="iap.iap" />
              </div>
            </PromisedButton>
          </div>
        </PaymentStatus>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import ArmySummonType from "@/../knightlands-shared/army_summon_type";
import UserDialog from "@/components/UserDialog.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";

import PriceTag from "@/components/PriceTag.vue";
import Title from "@/components/Title.vue";
import FreeSummon from "./FreeSummon.vue";

export default {
  props: [
    "info",
    "summonType",
    "fetchRequest",
    "summonCb",
    "purchaseSummonCb",
    "continuePurchaseCb"
  ],
  components: {
    UserDialog,
    PromisedButton,
    PaymentStatus,
    PriceTag,
    Title,
    FreeSummon
  },
  data: () => ({
    request: null,
    ArmySummonType
  }),
  watch: {
    fetchRequest() {
      console.log(this.fetchRequest)
    }
  },
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
    batchSummon() {
      this.summonCb(this.batchSize);
      this.$close();
    },
    singleSummon() {
      this.summonCb(1);
      this.$close();
    },
    purchaseSummon(iap) {
      this.purchaseSummonCb(iap);
      this.$close();
    },
    continuePurchase(payload) {
      this.continuePurchaseCb(payload);
      this.$close();
    }
  }
};
</script>
