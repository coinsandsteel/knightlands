<template>
  <custom-button type="grey" @click="showSelector">{{caption}}</custom-button>
</template>

<script>
import CustomButton from "./Button.vue";
import DifficultySelector from "./DiffcultySelector.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import UiConstants from "@/ui_constants";

const DifficultySelectorDialog = CreateDialog(
  DifficultySelector,
  "stages",
  "current"
);

export default {
  components: {
    CustomButton
  },
  props: ["stages", "current", "cb"],
  computed: {
    stage() {
      return this.$store.getters.getZoneStage(this.current);
    },
    caption() {
      return "Difficulty: " + UiConstants.stageNames[this.stage];
    }
  },
  methods: {
    async showSelector() {
      let difficultyIndex = await DifficultySelectorDialog(
        this.stages,
        this.stage
      );

      this.cb(difficultyIndex);
    }
  }
};
</script>

