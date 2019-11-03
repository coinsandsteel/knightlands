<template>
  <trials-list v-bind="$attrs">
    <template slot-scope="scope">
      <TrialListElement
        v-for="(trial, index) in trials"
        :key="trial.id"
        :index="index"
        :trial="trial"
        
        :trialType="scope.trialType"
        :locked="!scope.unlockedTrials[trial.id]"
        @click="scope.open(trial.id, index)"
      ></TrialListElement>
    </template>
  </trials-list>
</template>

<script>
import TrialsList from "../TrialsList.vue";
import TrialListElement from "./../TrialListElement.vue";
import ConjuredTrialsMeta from "@/conjured_trials";

export default {
  components: { TrialsList, TrialListElement },
  data: () => ({
    trials: ConjuredTrialsMeta.trials
  })
};
</script>