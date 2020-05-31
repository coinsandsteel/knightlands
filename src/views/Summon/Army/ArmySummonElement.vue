<template>
  <div class="flex flex-column flex-end padding-bottom-2">
    <PromisedButton
      v-if="freeSummonTimer.timeLeft <= 0"
      type="yellow"
      @click="freeSummon"
    >{{ $t("free-summon") }}</PromisedButton>

    <CustomButton
      type="yellow"
      v-else-if="summonType == ArmySummonType.Normal"
      @click="showPopup"
    >{{$t("basic-summon")}}</CustomButton>
    <CustomButton type="yellow" v-else @click="showPopup">{{$t("advanced-summon")}}</CustomButton>
  </div>
</template>

<script>
import PromisedButton from "@/components/PromisedButton.vue";
import CustomButton from "@/components/Button.vue";
import ArmySummonType from "@/../knightlands-shared/army_summon_type";
import Timer from "@/timer";

import ArmySummonPopup from "./ArmySummonPopup.vue";
import { create } from "vue-modal-dialogs";
const SummonPopup = create(ArmySummonPopup, "info", "summonType");

export default {
  props: ["info", "summonType"],
  components: { CustomButton, PromisedButton },
  data: () => ({
    ArmySummonType,
    freeSummonTimer: new Timer(true)
  }),
  watch: {
    info: {
      immediate: true,
      handler() {
        this.update();
      }
    }
  },
  methods: {
    update() {
      if (!this.info.meta) {
        return;
      }

      if (this.info.meta.freeOpens > 0) {
        let resetCycle = 86400000 / this.info.meta.freeOpens;
        let timeUntilNextFreeOpening = this.$game.now - this.info.lastSummon;
        this.freeSummonTimer.timeLeft =
          (resetCycle - timeUntilNextFreeOpening) / 1000;
      }
    },
    showPopup() {
      SummonPopup(this.info, this.summonType);
    },
    freeSummon() {
      this.$emit("freeSummon", this.summonType);
    }
  }
};
</script>
