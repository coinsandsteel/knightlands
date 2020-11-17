<template>
  <div class="mask relative flex flex-center">
    <StripedPanel
      containerClasses="width-90"
      class="flex-no-wrap relative flex flex-center flex-column"
      v-show="ready"
    >
      <SpinePlayer
        class="level-up-animation"
        ref="animation"
        skeletonFile="levelup"
        skeletonName="levelup"
        atlas="levelup"
        atlasImage="levelup"
        :style="animationPosition"
        @ready="handleAnimationReady"
      ></SpinePlayer>
      <span ref="hook"></span>
      <span class="level-up-spacer"></span>
      <span class="grey-title font-size-20 font-weight-700">{{
        $t("level-up-title")
      }}</span>
      <span
        class="font-size-4 margin-bottom-3 font-weight-700"
        v-html="$t('level-up-title2', { level: $game.character.level })"
      ></span>

      <StripedContent class="flex flex-center font-size-20" stripeHeight>
        <ul class="level-up-list">
          <li v-if="soft > 0">
            <IconWithValue
              :flip="true"
              class="flex-start"
              iconClass="icon-gold"
              >{{ soft }}</IconWithValue
            >
          </li>
          <li v-if="hard > 0">
            <IconWithValue
              :flip="true"
              class="flex-start"
              iconClass="icon-premium"
              >{{ hard }}</IconWithValue
            >
          </li>
          <li>Max training stats +5</li>
          <li v-for="stat in stats" :key="stat.stat">
            {{
              $t("level-up-stat", { stat: $t(stat.stat), value: stat.value })
            }}
          </li>
        </ul>
      </StripedContent>

      <div class="flex flex-center">
        <CustomButton
          class="center margin-top-3"
          type="yellow"
          @click="$close"
          >{{ $t("continue") }}</CustomButton
        >
      </div>
    </StripedPanel>
  </div>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import SpinePlayer from "@/components/SpinePlayer.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import CustomButton from "@/components/Button.vue";
import LevelUpMeta from "@/levelup_meta";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: {
    SpinePlayer,
    StripedPanel,
    StripedContent,
    CustomButton,
    IconWithValue
  },
  data: () => ({
    ready: false,
    animationPosition: ""
  }),
  methods: {
    handleAnimationReady() {
      this.ready = true;
      this.$nextTick(() => {
        var state = this.$refs.animation.getState();
        state.setAnimation(0, "show", false);
        state.setAnimation(1, "loop", true);
        // let top = this.$refs.hook.getBoundingClientRect().top;
        // this.animationPosition = `transform: translateY(${top}px);`;
      });
    }
  },
  computed: {
    meta() {
      return LevelUpMeta[this.$game.character.level - 1];
    },
    stats() {
      return this.meta.stats;
    },
    soft() {
      return this.meta.soft;
    },
    hard() {
      return this.meta.hard;
    }
  }
};
</script>

<style lang="less" scoped>
.level-up-animation {
  transform: translateY(-50%);
  position: absolute;
  width: 140%;
  left: -20%;
  pointer-events: none;
  z-index: 1;
  height: 100vh;
}

.level-up-spacer {
  margin-top: 10rem;
}

.level-up-list {
  list-style: none;
  padding: 0;

  & > li {
    background-image: url("../assets/ui/bullet.png");
    padding-left: 2rem;
    background-position: left;
    background-size: 1.6rem 1.6rem;
    background-repeat: no-repeat;
    text-align: left;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }
}

.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.555);
  z-index: 900;
}
</style>
