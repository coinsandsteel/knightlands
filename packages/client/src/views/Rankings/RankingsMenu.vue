<template>
  <div class="flex flex-space-evenly width-100 flex-no-wrap">
    <LockedSection
      class="rankings-bg pointer"
      v-for="(rankingType, index) in rankings"
      :key="index"
      :section="sectionName(rankingType)"
    >
      <div
        class="flex flex-column flex-center flex-space-between margin-bottom-1"
        :class="`color-${rankingType}`"
        @click="goTo(rankingType)"
      >
        <span :class="icon(rankingType)" class="icon-menu"></span>
        <span class="ranking-title font-outline padding-1 font-weight-900">{{
          $t(`window-${rankingType}`)
        }}</span>
      </div>
    </LockedSection>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import LockedSection from "@/components/LockedSection.vue";

const rankings = ["leaderboards", "tournaments", "races"];

export default {
  mixins: [AppSection],
  components: { LockedSection },
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
    sectionName(rankingType) {
      switch (rankingType) {
        case "tournaments":
          return "tournament";
        case "races":
          return "sprints";
      }

      return "";
    },
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
  width: 7rem !important;
  height: 7rem !important;
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
