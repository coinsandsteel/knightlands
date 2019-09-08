<script>
export default {
    paymentEvents: [],
    mounted() {
        this.listener = this._handlePaymentComplete.bind(this);
        this.$options.paymentEvents.forEach(evt=>{
            this.$game.on(evt, this.listener);
        });
    },
    destroyed() {
        this.$options.paymentEvents.forEach(evt=>{
            this.$game.off(evt, this.listener);
        });
    },
    methods: {
        async _handlePaymentComplete(data) {
            await this.fetchPaymentStatus(data.iap);
            this.handlePaymentComplete(data.iap, data.context);
        },
        handlePaymentComplete(iap, context) {},
        async purchaseRequest(purchaseRequest) {
            let response = await purchaseRequest;
            let { signature, price, iap, paymentId } = response;
            if (signature && price && iap && paymentId) {
                await this.purchase(signature, price, iap, paymentId);
            } else {
                return response;
            }
        },
        async purchase(signature, price, iap, paymentId) {
            await this.fetchPaymentStatus(iap);

            try {
                await this.$game.purchaseIAP(iap, paymentId, price, signature);
                await this.fetchPaymentStatus(iap);
            } catch (exc) {
                console.log("Payment failed with exception", exc);
            }
        },
        async continuePurchase(paymentStatus) {
            let { signature, price, iap, paymentId } = paymentStatus;
            await this.purchase(signature, price, iap, paymentId);
        }
    }
}
</script>