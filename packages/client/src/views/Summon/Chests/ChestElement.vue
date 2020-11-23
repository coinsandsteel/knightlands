<template>
  <div class="margin-bottom-1 margin-top-1 padding-1 color-panel-1">
    <div class="flex flex-items-center flex-space-between flex-no-wrap">
      <div :class="chest.name"></div>
      <span
        class="font-size-20 width-80 text-align-left"
        v-html="$t(`${chest.name}-desc`)"
      ></span>
    </div>

    <div class="flex flex-space-between">
      <div>
        <div class="flex flex-center">
          <div class="flex flex-items-center panel-input padding-1">
            <div class="item-icon" :class="keyIcon"></div>
            <span class="font-size-18">{{ totalKeys }}</span>
          </div>
        </div>
      </div>

      <template v-if="freeOpenAvailable">
        <CustomButton type="yellow" @click="$emit('open', chest.name)">
          <div class="flex flex-items-center">
            <span class="margin-right-half">{{ $t("btn-open-free") }}</span>
          </div>
        </CustomButton>
      </template>

      <div class="flex flex-column flex-items-end" v-else-if="hasKey">
        <span
          class="font-size-18 margin-bottom-half"
          v-show="timer.timeLeft > 0"
          >{{ $t("free-chest-timer", { timer: timer.value }) }}</span
        >

        <div class="flex flex-center flex-items-end flex-column">
          <CustomButton
            :disabled="!hasKey"
            type="yellow"
            @click="$emit('open', chest.name)"
          >
            <div class="flex flex-items-center">
              <span class="margin-right-half">{{ $t("btn-open") }}</span>
              <div class="item-icon" :class="keyIcon"></div>
            </div>
          </CustomButton>
          <CustomButton
            class="margin-top-1"
            v-show="batchSize > 1"
            type="yellow"
            @click="$emit('openBatch', chest.name, batchSize)"
          >
            <div class="flex flex-items-center">
              <span class="margin-right-half">{{ $t("btn-open") }}</span>
              <div class="item-icon" :class="keyIcon"></div>
              <span>x{{ batchSize }}</span>
            </div>
          </CustomButton>
        </div>
      </div>

      <PaymentStatus
        ref="status"
        :request="fetchPayment"
        @pay="continuePurchase"
        @iap="setIap"
        v-else-if="chest.meta.iaps.length > 0"
      >
        <div class="flex flex-center flex-items-end flex-column">
          <span
            class="font-size-18 margin-bottom-half"
            v-show="timer.timeLeft > 0"
            >{{ $t("free-chest-timer", { timer: timer.value }) }}</span
          >

          <PromisedButton
            v-for="iap in chest.meta.iaps"
            :key="iap.iap"
            :promise="request"
            :forceLoading="pending"
            type="yellow"
            @click="purchaseChestOpening(iap.iap)"
            class="margin-bottom-1"
          >
            <div class="flex flex-items-center">
              <span>{{ $t("btn-open") }}</span>
              <span
                v-if="iap.count > 1"
                class="margin-left-half margin-right-half"
                >x{{ iap.count }}</span
              >
              <PriceTag :dark="true" :iap="iap.iap" :flip="false"></PriceTag>
            </div>
          </PromisedButton>
        </div>
      </PaymentStatus>
      <span
        class="font-size-18 margin-bottom-half"
        v-else
        v-show="timer.timeLeft > 0"
        >{{ $t("free-chest-timer", { timer: timer.value }) }}</span
      >
    </div>
  </div>
</template>

<script>
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";
import PriceTag from "@/components/PriceTag.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import Events from "@/../../knightlands-shared/events";
import PromisedButton from "@/components/PromisedButton.vue";

export default {
  props: ["chest", "pending"],
  mixins: [PaymentHandler],
  components: {
    StripedPanel,
    StripedContent,
    CustomButton,
    PriceTag,
    PaymentStatus,
    PromisedButton
  },
  created() {
    this.$options.paymentEvents = [Events.ChestOpened];
  },
  data: () => ({
    timer: new Timer(true),
    fetchPayment: null,
    request: null
  }),
  mounted() {
    this.updateAll();
    this.fetchPaymentStatus();
  },
  watch: {
    chest() {
      this.updateAll();
      this.fetchPaymentStatus();
    }
  },
  methods: {
    purchaseChestOpening(iap) {
      this.request = this.$game.openChest(this.chest.name, iap);
      this.purchaseRequest(this.request);
    },
    async fetchPaymentStatus() {
      if (this.chest.meta.iaps.length > 0) {
        this.fetchPayment = this.$game.getchChestOpenStatus(this.chest.name);
        await this.fetchPayment;
        if (this.$refs.status && this.$refs.status.pending) {
          this.$emit("wait");
        }
      }
    },
    handlePaymentComplete(iap, context) {
      if (this.chest.meta.iaps.find(x => x.iap == iap)) {
        this.$emit("open", this.chest.name, null, context);
      }
    },
    updateAll() {
      if (this.chest.meta.freeOpens > 0) {
        let resetCycle = 86400000 / this.chest.meta.freeOpens;
        let timeUntilNextFreeOpening =
          this.$game.now - this.chest.lastFreeOpening;
        this.timer.timeLeft = (resetCycle - timeUntilNextFreeOpening) / 1000;
      }
    }
  },
  computed: {
    keyIcon() {
      return this.$game.itemsDB.getIcon(this.chest.meta.keyItem);
    },
    totalKeys() {
      return this.$game.inventory.getItemsCountByTemplate(
        this.chest.meta.keyItem
      );
    },
    batchSize() {
      return this.totalKeys > 10 ? 10 : this.totalKeys;
    },
    hasKey() {
      return this.totalKeys > 0;
    },
    freeOpenAvailable() {
      return this.chest.meta.freeOpens > 0 && this.timer.timeLeft <= 0;
    }
  }
};
</script>

<style lang="less" scoped>
.chest-icon(@chest) {
  background: no-repeat url("../../../assets/ui/@{chest}.png");
  background-size: contain;
  background-position: center;
  width: 14rem;
  height: 14rem;
  display: inline-block;
  cursor: pointer;

  &.disabled {
    opacity: 0.3;
  }
}

.wooden_chest {
  .chest-icon("chest_small");
}

.silver_chest {
  .chest-icon("chest_medium");
}

.velvet_chest {
  .chest-icon("chest_large");
}
</style>
