<template>
  <div class="screen-content flex-justify-center">
    <div class="screen-background"></div>
    <div class="flex flex-space-evenly color-panel-1">
      <div
        class="rankings-bg flex flex-column flex-center flex-space-between margin-bottom-1 pointer"
        v-for="(rankingType, index) in rankings"
        :key="index"
        :style="background(rankingType)"
        :class="`color-${rankingType}`"
        @click="goTo(rankingType)"
      >
        <span :class="icon(rankingType)" class="icon-menu"></span>
        <span class="ranking-title font-outline padding-1 font-weight-700">{{
          $t(`window-${rankingType}`)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import MenuIcon from "@/components/MenuIcon.vue";

const rankings = ["leaderboards", "tournaments", "races"];

export default {
  mixins: [AppSection],
  components: { CustomButton, MenuIcon },
  data: () => ({
    rankings
  }),
  created() {
    this.title = "window-rankings";
  },
  methods: {
    goTo(rankingType) {
      let name = rankingType;
      this.$router.push({ name });
    },
    background(rankingType) {},
    icon(rankingType) {
      switch (rankingType) {
        case "leaderboards":
          return "icon-leaderboards";
        case "tournaments":
          return "icon-tournaments";
        case "races":
          return "icon-races";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.icon-menu {
  width: 7rem;
  height: 7rem;
}

.ranking-title {
  font-size: 2rem;
  background: rgb(38, 16, 52);
  background: linear-gradient(
    90deg,
    rgba(38, 16, 52, 0) 0%,
    rgba(38, 16, 52, 1) 30%,
    rgba(38, 16, 52, 1) 70%,
    rgba(38, 16, 52, 0) 100%
  );

  // min-width: 100%;
}

.rankings-bg {
  // height: 20vh;
  // background-size: cover;
  // background-position: center;
}

.color-armour {
  color: #bdb8ff;
}

.color-weapon {
  color: #ffe0a7;
}

.color-accessory {
  color: #6adafc;
}
</style>
