<template>
  <div
    class="width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
  >
    <div
      class="april-achievements-tips flex flex-row flex-no-wrap flex-justify-center font-size-22 padding-top-4 padding-bottom-4 relative"
    >
      {{ $t("april-achievements-tips") }}
    </div>
    <div
      class="april-achievements-container flex-full width-100 overflow-auto relative"
    >
      <div class="top-title-background absolute width-100"></div>
      <div v-for="achievement in achievements" :key="achievement.id">
        <Title class="">{{ achievement.name }}</Title>
        <div class="april-achievement-wrapper">
          <!-- hero -->
          <div class="flex flex-center padding-top-1 padding-bottom-1">
            <AprilHeroSlideItem :hero="achievement" />
          </div>
          <!-- points -->
          <div class="text-align-center font-size-22 font-weight-700">
            {{ achievement.points }} / {{ achievement.maxPoints }}
          </div>
          <!-- button -->
          <div class="text-align-center">
            <CustomButton
              type="green"
              class="btn-receive inline-block"
              :disabled="!achievement.canReceive"
              @click="claimHandler(achievement)"
            >
              {{ $t("btn-claim") }}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import * as april from "@/../../knightlands-shared/april";
import AprilHeroSlideItem from "@/views/April/AprilHeroSlideItem.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: {
    AprilHeroSlideItem
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("april", ["heroes", "heroRewards"]),
    achievements() {
      const achievements = [];
      achievements;
      for (let i = 0; i < this.heroes.length; i++) {
        const achievement = { ...this.heroes[i] };
        const heroReward = this.heroRewards[achievement.heroClass];
        achievement.points = heroReward.score;
        achievement.maxPoints = heroReward.goal;
        achievement.canReceive =
          heroReward.score >= heroReward.goal && !heroReward.claimed;

        achievements.push(achievement);
      }

      return achievements;
    }
  },

  activated() {
    this.fetchHeroStat();
  },

  methods: {
    async fetchHeroStat() {
      let items = await this.performRequestNoCatch(
        this.$store.dispatch("april/heroStat")
      );

      if (!(items && items[april.HERO_CLASS_KNIGHT])) {
        return;
      }

      this.$store.commit("april/updateState", { heroRewards: items });
    },
    async claimHandler(achievement) {
      const items = await this.performRequestNoCatch(
        this.$store.dispatch("april/claimReward", {
          type: april.REWARD_TYPE_HERO,
          heroClass: achievement.heroClass
        })
      );

      this.fetchHeroStat();

      if (items.length) {
        const ShowItems = create(ItemsReceived, "items");
        await ShowItems(items);
        this.hasRewards = false;
      }
    }
  }
};
</script>
<style scoped lang="less">
.april-achievements-tips,
.top-title-background {
  background: #2f7285;
}
.top-title-background {
  height: 10px;
}
.april-achievement-wrapper {
  display: grid;
  grid-template-columns: 140px 1fr 140px;
  align-items: center;
}
.btn-receive {
  min-width: 80px;
}
::v-deep .hero-slider-item {
  width: 100px;
  height: 100px;
}
</style>
