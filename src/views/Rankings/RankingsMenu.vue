<template>
  <div class="flex flex-items-center flex-start">
    <div
      class="rankings-bg width-100 flex flex-column flex-center flex-space-between margin-bottom-1"
      v-for="(rankingType, index) in rankings"
      :key="index"
      :style="background(rankingType)"
      :class="`color-${rankingType}`"
    >
      <span
        class="ranking-title font-outline padding-1 font-weight-700"
      >{{$t(`window-${rankingType}`)}}</span>
      <div class="flex margin-1">
        <CustomButton type="grey" @click="goTo(rankingType)">{{$t("btn-open")}}</CustomButton>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";

const rankings = ["leaderboards", "tournaments", "races"];

export default {
  mixins: [AppSection],
  components: { CustomButton },
  data: () => ({
    rankings
  }),
  created() {
    this.title = "windows-rankings";
  },
  methods: {
    goTo(rankingType) {
      let name = rankingType;
      this.$router.push({ name });
    },
    background(rankingType) {}
  }
};
</script>

<style lang="less" scoped>
.ranking-title {
  font-size: 4rem;
  line-height: 4rem;
  background: linear-gradient(
    90deg,
    rgba(38, 16, 52, 0) 0%,
    rgba(38, 16, 52, 0.5550595238095238) 42%,
    rgba(38, 16, 52, 0.5858718487394958) 100%
  );

  min-width: 100%;
}

.rankings-bg {
  height: 20vh;
  background-size: cover;
  background-position: center;
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
</style>router