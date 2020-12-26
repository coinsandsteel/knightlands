<template>
  <div class="flex flex-center font-size-18 flex-no-wrap">
    <div
      class="flex flex-center padding-1 padding-left-3 padding-right-3 panel-input height-100"
    >
      <div class="item-icon" :class="trialType"></div>
      <span>{{ totalTickets }}</span>
      <span
        class="item-icon icon-plus margin-left-half pointer"
        @click="$emit('purchaseAttempts')"
      ></span>
    </div>

    <CustomButton type="grey" @click="$emit('open')">{{
      $t("btn-level-trials-cards")
    }}</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  props: ["trialType"],
  components: { CustomButton },
  computed: {
    state() {
      return this.$game.getTrialState(this.trialType);
    },
    ticketItemName() {
      return this.$t(`trial-attempt-${this.trialType}`);
    },
    totalTickets() {
      if (!this.state) {
        return this.freeTickets;
      }

      return this.state.attempts + this.freeTickets;
    },
    freeTickets() {
      if (!this.state) {
        return 0;
      }

      return this.state.freeAttempts;
    }
  }
};
</script>
