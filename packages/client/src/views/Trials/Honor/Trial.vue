<template>
  <BaseTrial
    :trialType="trialType"
    :mountCallback="mountCallback"
    :meta="meta"
    :trialIndex="trialIndex"
    :state="state"
    v-on="$listeners"
  ></BaseTrial>
</template>

<script>
import BaseTrial from "../BaseTrial.vue";
import TrialsOfHonorMeta from "@/trials_of_honor";
import TrialType from "@/../../knightlands-shared/trial_type";

export default {
  props: ["id", "mountCallback", "state", "trialIndex"],
  components: { BaseTrial },
  created() {
    this.meta = TrialsOfHonorMeta.trials.find(x => x.id == this.id);
  },
  activated() {
    this.meta = TrialsOfHonorMeta.trials.find(x => x.id == this.id);
  },
  data: () => ({
    trialType: TrialType.Armour,
    meta: null
  })
};
</script>
