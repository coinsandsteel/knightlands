<template>
    <UserDialog title="trials-purchase-attempts" @close="$close">
        <template v-slot:content>
            <div class="flex flex-column flex-space-evenly width-100">
                <attempt-purchase-element v-for="type in trialTypes" :key="type" :trialType="type" :iaps="iapsByType[type]">

                </attempt-purchase-element>
            </div>
        </template>
    </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import TrialType from "@/../knightlands-shared/trial_type";
import AttemptPurchaseElement from "./AttemptPurchaseElement.vue";

const iapsByType = {};
iapsByType[TrialType.Armour] = require("@/trials_of_honor").iaps;
iapsByType[TrialType.Weapon] = require("@/conjured_trials").iaps;

export default {
    components: { UserDialog, CustomButton, IconWithValue, AttemptPurchaseElement },
    data: ()=>({
        trialTypes: TrialType,
        iapsByType
    })
}
</script>