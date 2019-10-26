<template>
  <div class="flex flex-center font-size-18 flex-no-wrap">
    <div class="flex flex-center padding-1 panel-input height-100">
      <span>{{$t("free-attemps", {attempts: freeTickets})}}</span>
    </div>

    <div class="flex flex-center padding-1 panel-input height-100">
      <div class="key-icon" :class="trialType"></div>
      <span>{{totalTickets}}</span>
    </div>

    <CustomButton type="grey" @click="$emit('open')">{{$t("btn-level-trials-cards")}}</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import TowerMeta from "@/tower_meta";

export default {
  props: ["trialType", "state"],
  components: { CustomButton },
  computed: {
    ticketItemName() {
      return this.$t(`trial-attempt-${this.trialType}`);
    },
    totalTickets() {
      if (!this.state) {
          return 0;
      }

      return this.state.attempts;
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

<style lang="less" scoped>
.key-icon {
  background-repeat: no-repeat;
  background-size: contain;
  width: 3rem;
  height: 3rem;
}

.armour {
  background-image: url("../../assets/ui/ticket_blue.png");
}

.weapon {
  background-image: url("../../assets/ui/ticket_red.png");
}
</style>