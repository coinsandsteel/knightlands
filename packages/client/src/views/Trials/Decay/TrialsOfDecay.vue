<template>
  <BaseTrials :trialType="trialType" titleStr="window-trials-accessory">
    <template slot="list" slot-scope="scope">
      <TrialsList v-bind="scope"></TrialsList>
    </template>
    <template slot="trial" slot-scope="scope">
        <Trial v-bind="scope" @engage="scope.engage"></Trial>
    </template>
  </BaseTrials>
</template>

<script>
import BaseTrials from "../BaseTrials.vue";
import TrialType from "@/../../knightlands-shared/trial_type";
import TrialsList from "./TrialsList.vue";
import Trial from "./Trial.vue";

export default {
  components: { BaseTrials, TrialsList, Trial },
  data: () => ({
    trialType: TrialType.Accessory
  })
};
</script>
