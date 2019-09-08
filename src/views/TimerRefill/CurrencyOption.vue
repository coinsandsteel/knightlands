<template>
    <div class="flex flex-basis-100 flex-column flex-item-center" v-show="methodChosen == 0">
        <div class="flex flex-column flex-center flex-1">
            <div class="flex flex-center margin-bottom-2 font-size-20">
            <div>Price to restore 100% of {{stat}}:</div>
            <div class="digit-font">9999 TRX</div>
            </div>

            <div class="flex flex-center font-size-15">Refills today: {{refillsToday}}</div>
        </div>

        <PaymentStatus :request="statusRequest"></PaymentStatus>
        <custom-button width="16rem" type="green" @click="confirm">{{$t("btn-confirm")}}</custom-button>
    </div>
</template>

<script>
export default {
    props: ["stat"],
    data: ()=>({
        statusRequest: null
    })
}
</script>