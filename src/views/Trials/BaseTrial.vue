<template>
  <Promised class="dummy-height flex width-100 height-100" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

      <keep-alive>
        <div class="width-100" v-bar v-if="!selectedStage">
          <div>
            <div class="flex flex-column" v-if="trialState">
              <TrialStageListElement
                v-for="(stage, index) in meta.stages"
                :key="stage.id"
                :index="index"
                :stage="stage"
                :state="trialState.stages[stage.id]"
                :locked="isStageLocked(index)"
                @hint="handleHint"
                @continue="continueToStage"
              ></TrialStageListElement>
            </div>
          </div>
        </div>

        <TrialStage
          v-else
          :trialType="trialType"
          :trialIndex="trialIndex"
          :stage="selectedStage"
          :fightState="state.currentFight"
          @engage="engageFight"
        ></TrialStage>
      </keep-alive>
    </template>
  </Promised>
</template>

<script>
import TrialStageListElement from "./TrialStageListElement.vue";
import HintHandler from "@/components/HintHandler.vue";
import TrialStage from "./TrialStage.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  props: ["trialType", "meta", "mountCallback", "state", "trialIndex"],
  mixins: [HintHandler],
  components: { TrialStageListElement, TrialStage, Promised, LoadingScreen },
  data: () => ({
    request: null,
    trialState: null,
    lastStageCleared: -1,
    selectedStage: null
  }),
  mounted() {
    this.mountCallback(this.handleBackButton.bind(this));
  },
  activated() {
    if (this.state.currentFight) {
      // open fight
      this.selectedStage = this.meta.stages.find(
        s => s.id == this.state.currentFight.stageId
      );
    }

    this.fetchRemoteState();
  },
  methods: {
    isStageLocked(stageIndex) {
      if (this.state.currentFight) {
        return (
          this.state.currentFight.stageId != this.meta.stages[stageIndex].id
        );
      }

      return stageIndex > this.lastStageCleared + 1;
    },
    engageFight(stageId, fightIndex) {
      this.$emit("engage", this.meta.id, stageId, fightIndex);
    },
    handleBackButton() {
      if (this.selectedStage) {
        this.selectedStage = null;
        return true;
      }

      return false;
    },
    async continueToStage(stageIndex) {
      this.selectedStage = this.meta.stages[stageIndex];
    },
    async fetchRemoteState() {
      this.request = this.$game.fetchTrialState(this.trialType, this.meta.id);
      this.trialState = await this.request;

      // find latest stageId that is not cleared yet
      const metaStages = this.meta.stages;

      this.lastStageCleared = -1; // index

      for (let i = 0; i < metaStages.length; ++i) {
        const stage = metaStages[i];
        const stageState = this.trialState.stages[stage.id];
        if (stageState && stageState.cleared) {
          this.lastStageCleared = i;
        } else {
          break;
        }
      }
    }
  }
};
</script>
