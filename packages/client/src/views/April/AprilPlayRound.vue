<template>
  <div
    class="width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <div
      class="april-play-stat flex flex-row flex-no-wrap flex-justify-center font-size-22 padding-top-2 padding-bottom-2 relative"
    >
      <AprilGold class="april-gold--with-background padding-left-2" />
      <div class="close-btn" @click="stopHandler"></div>
    </div>

    <div
      class="april-play-session-rewards-container flex-full flex flex-center width-100 overflow-auto"
    >
      <div
        class="april-play-session-reward april-play-session-reward--card relative"
      >
        <div
          class="april-play-session-reward-card-background absolute-stretch"
          :class="`april-card-background--${sessionRewardCardClass}`"
        ></div>
      </div>
      <div
        class="april-play-session-reward april-play-session-reward--hp"
      ></div>
    </div>
    <div
      class="april-play-rounds-container flex flex-center width-100 overflow-auto padding-top-2 padding-bottom-2"
    >
      <div
        v-for="(round, roundIndex) in rounds"
        :key="roundIndex"
        class="april-round-wrapper relative"
      >
        <!-- boss -->
        <div
          v-if="level === roundIndex + 1"
          class="april-round-current absolute-stretch"
          :class="`april-board-cell-hero--${heroClass}`"
        ></div>
        <!-- boss -->
        <div
          v-if="roundIndex === rounds.length - 1"
          class="april-round-boss absolute-stretch"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilStopGame from "@/views/April/AprilStopGame.vue";
export default {
  components: {
    AprilGold
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["appSize"]),
    ...mapState("april", ["level", "sessionRewardCardClass", "heroClass"]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 10)
        : Math.floor(375 / 10);
    },
    rounds() {
      return new Array(9).fill(null);
    }
  },
  methods: {
    async stopHandler() {
      const showDialog = create(AprilStopGame);
      const result = await showDialog();
      if (result) {
        this.$store.dispatch("april/exitGame");
        this.$emit("next", true);
      }
    }
  }
};
</script>
<style scoped lang="less">
.april-play-stat {
  background: #2f7285;
}
.april-play-session-reward {
  width: calc(3 * var(--base-size));
  height: calc(4.5 * var(--base-size));
  margin: 0 calc(0.5 * var(--base-size));
}
.april-play-session-reward--card {
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #eee;
}
.april-play-session-reward--hp {
  background-image: url("/images/april/hp.png");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
.april-play-session-reward-card-background {
  border-radius: 6px;
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-round-wrapper {
  background: #c4c4c4;
  width: var(--base-size);
  height: var(--base-size);
  border-radius: 50%;
  margin: 0 calc(0.05 * var(--base-size));
}
.april-round-current {
  border-radius: 50%;
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-round-boss {
  border-radius: 50%;
  border: 2px solid #ffe712;
}
</style>
