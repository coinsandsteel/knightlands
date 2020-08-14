<template>
  <CustomButton
    class="margin-top-1"
    type="yellow"
    @click="$emit('summon')"
    v-if="freeSummonTimer.timeLeft <= 0"
  >
    <span>{{$t('free-summon')}}</span>
  </CustomButton>

  <div class="flex flex-center flex-column" v-else>
    <span
      class="font-size-18 margin-bottom-half"
    >{{$t("free-summon-timer", {timer: freeSummonTimer.value})}}</span>
    <slot></slot>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";

export default {
  props: ["info"],
  components: { CustomButton },
  data: () => ({
    freeSummonTimer: new Timer(true)
  }),
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler() {
        if (this.info && this.info.meta && this.info.meta.freeOpens > 0) {
          let resetCycle = 86400 / this.info.meta.freeOpens;
          let timeElapsed = this.$game.nowSec - this.info.lastSummon;
          this.freeSummonTimer.timeLeft = resetCycle - timeElapsed;
        }
      }
    }
  }
};
</script>
