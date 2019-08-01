<template>
  <user-dialog title="Select Difficulty" @close="$close(current)">
    <template v-slot:content>
      <div class="flex flex-center flex-column flex-space-between button-column">
        <custom-button
          v-for="(status, index) in stages"
          :key="index"
          :type="getStageBtnStyle(index)"
          :caption="getStageBtnCaption(index)"
          :disabled="!status"
          :lockPressed="index == current"
          @click="$close(index)"
        ></custom-button>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "./UserDialog.vue";
import CustomButton from "./Button.vue";
import UiConstants from "@/ui_constants";

export default {
  components: {
    UserDialog,
    CustomButton
  },
  props: ["stages", "current"],
  methods: {
    getStageBtnStyle(stage) {
      switch (stage) {
        case 0:
          return "green";
        case 1:
          return "blue";
        case 2:
          return "yellow";
        case 3:
          return "red";
      }
      return "";
    },
    getStageBtnCaption(stage) {
      return UiConstants.stageNames[stage];
    }
  }
};
</script>


<style lang="less" scoped>
.button-column {
  margin-top: 1rem;
  padding: 0.2rem;

  * > {
    margin: 0.2rem;
  }
}
</style>


