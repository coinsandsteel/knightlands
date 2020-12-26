<template>
  <PromisedView
    class="dummy-height flex width-100 height-100"
    :promise="request"
  >
    <template v-slot:loaded>
      <keep-alive>
        <div class="width-100 height-100" v-bar v-if="!selectedStage">
          <div>
            <div class="flex flex-column padding-top-2">
              <TrialStageListElement
                v-for="(stage, index) in meta.stages"
                :key="stage.id"
                :index="index"
                :stage="stage"
                :state="trialState && trialState.stages[stage.id]"
                :locked="isStageLocked(index)"
                :inFight="!!state.currentFight"
                :element="getElement(stage.id)"
                @hint="handleHint"
                @continue="continueToStage"
                @collect="collectStageReward"
              ></TrialStageListElement>
            </div>
          </div>
        </div>

        <TrialStage
          v-else
          :trialMeta="meta"
          :trialType="trialType"
          :trialIndex="trialIndex"
          :stage="selectedStage"
          :state="selectedStateState"
          :fightState="state.currentFight"
          @engage="engageFight"
          @cleared="handleStageCleared"
        ></TrialStage>
      </keep-alive>
    </template>
  </PromisedView>
</template>

<script>
import PromisedView from "@/components/PromisedView.vue";
import TrialStageListElement from "./TrialStageListElement.vue";
import HintHandler from "@/components/HintHandler.vue";
import TrialStage from "./TrialStage.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";
import Elements from "@/../../knightlands-shared/elements";

import { create } from "vue-modal-dialogs";

const ShowRewards = create(ItemsReceived, "items", "soft", "exp");

export default {
  props: ["trialType", "meta", "mountCallback", "trialIndex"],
  mixins: [HintHandler, PromptMixin],
  components: {
    TrialStageListElement,
    TrialStage,
    PromisedView
  },
  data: () => ({
    request: null,
    trialState: null,
    lastStageCleared: -1,
    selectedStage: null,
    selectedStateState: null
  }),
  mounted() {
    this.mountCallback(this.handleBackButton.bind(this));
  },
  computed: {
    state() {
      return this.$game.getTrialState(this.trialType);
    }
  },
  watch: {
    selectedStage: {
      handler() {
        if (this.selectedStage && this.trialState) {
          this.selectedStateState = this.trialState.stages[
            this.selectedStage.id
          ];
        }
      },
      immediate: true
    },
    trialType: {
      handler() {
        if (this._stateWatcher) {
          this._stateWatcher();
        }
        this._stateWatcher = this.$watch(
          `state.trials.${this.meta.id}.stages`,
          this.refresh.bind(this)
        );
        this.refresh();
      },
      immediate: true
    }
  },
  methods: {
    refresh() {
      this.trialState = this.state.trials[this.meta.id];

      if (this.state.currentFight) {
        const stageId = this.state.currentFight.stageId;
        // open fight
        this.selectedStage = this.meta.stages.find(s => s.id == stageId);
        this.selectedStateState = this.trialState.stages[this.selectedStage.id];
      }

      // find latest stageId that is not cleared yet
      const metaStages = this.meta.stages;

      this.lastStageCleared = -1; // index

      if (this.trialState) {
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
    },
    handleStageCleared() {
      this.selectedStage = null;
      this.showPrompt("trial-stage-cleared-t", "trial-stage-cleared-m", [
        {
          type: "green",
          title: this.$t("btn-ok"),
          response: "ok"
        }
      ]);
      this.refresh();
    },
    getElement(stageId) {
      if (!this.state.elements) return Elements.Physical;
      return this.state.elements[stageId];
    },
    isStageLocked(stageIndex) {
      if (this.state.currentFight) {
        return (
          this.state.currentFight.stageId != this.meta.stages[stageIndex].id
        );
      }

      return stageIndex > this.lastStageCleared + 1;
    },
    engageFight(stageId, fightIndex) {
      this.$emit("engage", this.meta.id, stageId, fightIndex, () => {});
    },
    handleBackButton() {
      if (this.selectedStage) {
        this.selectedStage = null;
        return true;
      }

      return false;
    },
    continueToStage(stageIndex) {
      this.selectedStage = this.meta.stages[stageIndex];
    },
    async collectStageReward(stageIndex) {
      const stageMeta = this.meta.stages[stageIndex];
      this.request = this.$game.collectTrialStageReward(
        this.trialType,
        this.meta.id,
        stageMeta.id
      );

      const results = await this.request;
      ShowRewards(results.items, results.soft, results.exp);
    }
  }
};
</script>
