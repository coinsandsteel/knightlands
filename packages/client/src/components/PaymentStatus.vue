<template>
  <div class="relative width-100 overflow-hidden full-flex">
    <slot></slot>

    <div
      class="absolute-stretch overlay-color purchase-overlay flex flex-center"
      v-if="pending || waitingForPayment"
    >
      <keep-alive>
        <LoadingIndicator v-if="pending">
          <div class="font-size-20">
            {{ $t("waiting-for-tx-confirmation") }}
          </div>
        </LoadingIndicator>

        <div
          class="flex flex-column flex-center width-100"
          v-else-if="waitingForPayment"
        >
          <div class="font-size-20 margin-bottom-3 font-outline">
            {{ $t("waiting-for-payment") }}
          </div>

          <div class="flex flex-center flex-space-evenly width-100">
            <CustomButton type="yellow" @click="$emit('pay', status)">{{
              $t("btn-pay")
            }}</CustomButton>

            <CustomButton
              v-if="cancel"
              type="red"
              @click="$emit('cancel', status)"
              >{{ $t("btn-cancel-pay") }}</CustomButton
            >
          </div>
        </div>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import PaymentStatus from "@/../../knightlands-shared/payment_status";
import CustomButton from "@/components/Button.vue";
import { mapState } from "vuex";

export default {
  components: { LoadingIndicator, CustomButton },
  props: {
    cancel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      status: state => state.shop.status
    }),
    pending() {
      return (this.status || {}).status === PaymentStatus.Pending;
    },
    waitingForPayment() {
      return (this.status || {}).status === PaymentStatus.WaitingForTx;
    }
  }
};
</script>

<style lang="less" scoped>
.purchase-overlay {
  z-index: 100;
}
</style>
