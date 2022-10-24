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
import ConjuredTrialsMeta from "@/metadata/conjured_trials";

export default {
  components: { TrialsList, TrialListElement },
  data: () => ({
    trials: ConjuredTrialsMeta.trials
  })
};
</script>
