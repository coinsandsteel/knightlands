<template>
  <user-dialog title="Select Difficulty" @close="handleClose" :emitClose="true">
    <template v-slot:content>
      <div
        class="flex flex-center flex-column flex-space-between button-column"
      >
        <div
          v-for="(status, index) in stages"
          :key="index"
          class="flex flex-center flex-column"
        >
          <custom-button
            :type="getStageBtnStyle(index)"
            :caption="getStageBtnCaption(index)"
            :disabled="!isUnlocked(index)"
            :lockPressed="index == current"
            @click="$close(index)"
          ></custom-button>
          <span
            v-if="!isUnlocked(index)"
            class="font-size-18 font-shadow rarity-mythical"
            >{{
              $t("finish-zone", {
                zone: lastZoneName,
                difficulty: getStageBtnCaption(index - 1)
              })
            }}</span
          >
        </div>
      </div>
    </template>
  </user-dialog>
</template>

<script>
import UserDialog from "./UserDialog.vue";
import CustomButton from "./Button.vue";
import UiConstants from "@/ui_constants";
import Campaign from "@/campaign_database";

export default {
  components: {
    UserDialog,
    CustomButton
  },
  props: ["stages", "current"],
  data: () => ({
    lastZoneName: ""
  }),
  async mounted() {
    let zones = await this.$game.getZonesData();
    this.lastZoneName = this.$t(Campaign.getZoneName(zones.length));
  },
  methods: {
    isUnlocked(stage) {
      if (stage > 0) {
        return this.stages[stage - 1];
      } else {
        return true;
      }
    },
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
      return this.$t(UiConstants.stageNames[stage]);
    },
    handleClose() {
      this.$close(this.current);
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
