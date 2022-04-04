<template>
  <trials-list v-bind="$attrs">
    <template slot-scope="scope">
      <TrialListElement
        v-for="(trial, index) in trials"
        :key="trial.id"
        :index="index"
        :trial="trial"
        :trialType="scope.trialType"
        @click="scope.open(trial.id, index)"
      ></TrialListElement>
    </template>
  </trials-list>
</template>

<script>
import TrialsList from "../TrialsList.vue";
import TrialListElement from "./../TrialListElement.vue";
import TrialsOfHonorMeta from "@/metadata/trials_of_honor";

export default {
  components: { TrialsList, TrialListElement },
  data: () => ({
    trials: TrialsOfHonorMeta.trials
  })
};
</script>
