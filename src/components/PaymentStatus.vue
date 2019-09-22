<template>
    <div class="flex flex-column flex-center">
        <keep-alive>
            <LoadingIndicator v-if="pending" >
                <div class="font-size-15">{{$t("waiting-for-tx-confirmation")}}</div>
            </LoadingIndicator>

            <div class="flex flex-column flex-center" v-else-if="waitingForPayment">
                <CustomButton type="yellow" @click="$emit('pay', status)">{{$t("btn-pay")}}</CustomButton>
                <div class="font-size-15 margin-top-1">{{$t("waiting-for-payment")}}</div>
            </div>

            <slot v-else></slot>
        </keep-alive>
    </div>
</template>

<script>
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import PaymentStatus from "@/../knightlands-shared/payment_status";
import CustomButton from "@/components/Button.vue";

export default {
    components: { LoadingIndicator, CustomButton },
    props: ["request"],
    data: ()=>({
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
        }
    },
    computed: {
        pending() {
            return (
                (this.status || {}).status ===
                PaymentStatus.Pending
            );
        },
        waitingForPayment() {
            return (
                (this.status || {}).status ===
                PaymentStatus.WaitingForTx
            );
        }
    }
}
</script>