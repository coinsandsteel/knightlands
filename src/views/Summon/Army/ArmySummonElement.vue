<template>
  <div class="flex flex-column flex-end padding-bottom-2">
    <CustomButton>Summon x1</CustomButton>
    <CustomButton>Summon x10</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";

export default {
  props: ["info"],
  components: { CustomButton },
  data: () => ({
    timer: new Timer(true)
  }),
  methods: {
    update() {
      if (this.info.meta.freeOpens > 0) {
        let resetCycle = 86400000 / this.info.meta.freeOpens;
        let timeUntilNextFreeOpening = this.$game.now - this.info.lastSummon;
        this.timer.timeLeft = (resetCycle - timeUntilNextFreeOpening) / 1000;
      }
    }
  }
};
</script>
