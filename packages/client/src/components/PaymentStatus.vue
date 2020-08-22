<template>
  <div class="flex flex-column flex-center">
    <keep-alive>
      <LoadingIndicator v-if="pending">
        <div class="font-size-15">{{ $t("waiting-for-tx-confirmation") }}</div>
      </LoadingIndicator>

      <div
        class="flex flex-column flex-center width-100"
        v-else-if="waitingForPayment"
      >
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
        <div class="font-size-15 margin-top-1">
          {{ $t("waiting-for-payment") }}
        </div>
      </div>

      <slot v-else></slot>
    </keep-alive>
  </div>
</template>

<script>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import PaymentStatus from "@/../../knightlands-shared/payment_status";
import CustomButton from "@/components/Button.vue";

export default {
  components: { LoadingIndicator, CustomButton },
  props: {
    request: Promise,
    cancel: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    status: null
  }),
  mounted() {
    this.waitForStatus();
  },
  watch: {
    request() {
      this.waitForStatus();
    }
  },
  methods: {
    async waitForStatus() {
      this.status = await this.request;
      if (this.status) {
        this.$emit("iap", this.status.iap);
      }
    }
  },
  computed: {
    pending() {
      return (this.status || {}).status === PaymentStatus.Pending;
    },
    waitingForPayment() {
      return (this.status || {}).status === PaymentStatus.WaitingForTx;
    }
  }
};
</script>
