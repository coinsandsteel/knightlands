<template>
  <custom-button type="grey" @click="showSelector">{{ caption }}</custom-button>
</template>

<script>
import CustomButton from "./Button.vue";
import DifficultySelectorDialog from "./DifficultySelectorDialog.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import UiConstants from "@/ui_constants";

const ShowDifficultySelectorDialog = CreateDialog(
  DifficultySelectorDialog,
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
      return this.$store.getters.getZoneStage;
    },
    caption() {
      return "Difficulty: " + UiConstants.stageNames[this.stage];
    }
  },
  methods: {
    async showSelector() {
      let difficultyIndex = await ShowDifficultySelectorDialog(
        this.stages,
        this.stage
      );

      this.cb(difficultyIndex);
    }
  }
};
</script>
