<template>
  <PromisedButton type="grey" @click="refresh" :promise="request">
    <div class="flex flex-center font-size-18">
        <div class="icon-refresh"></div>
        <span v-if="timer.timeLeft > 0">{{$t("next-refresh", {time: timer.value})}}</span>
        <span v-else>{{$t("btn-refresh")}}</span>
    </div>
  </PromisedButton>
</template>

<script>
import PromisedButton from "@/components/PromisedButton.vue";
import Timer from "@/timer";

export default {
  components: { PromisedButton },
  props: ["adventure", "index"],
  data: () => ({
    request: null,
    timer: new Timer(true)
  }),
  mounted() {
    this.refreshTimer();
  },
  methods: {
    async refresh() {
      if (this.timer.timeLeft > 0) {
        return;
      }

      this.request = this.$game.refreshAdventure(this.index);

      let newAdventure = await this.request;
      this.adventure.list = newAdventure.list;
      this.$set(this.adventure, "refreshTime", newAdventure.refreshTime);
      this.refreshTimer();
    },
    refreshTimer() {
      this.timer.timeLeft = 86400 - (this.$game.now - this.adventure.refreshTime) / 1000;
    }
  }
};
</script>