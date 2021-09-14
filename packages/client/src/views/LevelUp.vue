<template>
  <div class="mask relative flex flex-center">
    <div
      class="flex flex-column flex-item-center flex-no-wrap flex-column panel-popup width-100 padding-1"
      v-show="ready"
    >
      <SpinePlayer
        class="level-up-animation"
        ref="animation"
        skeletonFile="levelup"
        skeletonName="levelup"
        atlas="levelup"
        atlasImage="levelup"
        @ready="handleAnimationReady"
        :binary="true"
        :useTriangleRendering="false"
      ></SpinePlayer>
      <SoundEffect ref="fx" :files="['char_lvl_up']" channel="fx" />
      <div class="level-up-spacer"></div>
      <span class="grey-title font-size-20 font-weight-700">{{
        $t("level-up-title")
      }}</span>
      <span
        class="font-size-4 margin-bottom-3 font-weight-700"
        v-html="$t('level-up-title2', { level: $game.character.level })"
      ></span>

      <div class="flex flex-center font-size-20">
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
          <li>{{ $t("lvl-up-stats", { stats: trainingStats }) }}</li>
          <li v-for="stat in stats" :key="stat.stat">
            <IconWithValue :iconClass="getIcon(stat.stat)"
              >+{{ stat.value }}</IconWithValue
            >
          </li>
        </ul>
      </div>

      <div class="flex flex-center">
        <CustomButton
          class="center margin-top-3"
          type="yellow"
          @click="$close"
          >{{ $t("continue") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import SpinePlayer from "@/components/SpinePlayer.vue";
import CustomButton from "@/components/Button.vue";
import LevelUpMeta from "@/levelup_meta";
import IconWithValue from "@/components/IconWithValue.vue";
import CharacterStat from "@/../../knightlands-shared/character_stat";

export default {
  components: {
    SoundEffect,
    SpinePlayer,
    CustomButton,
    IconWithValue
  },
  data: () => ({
    ready: false,
    animationPosition: ""
  }),
  props: ["data"],
  methods: {
    getIcon(stat) {
      switch (stat) {
        case CharacterStat.Health:
          return "icon-health";

        case CharacterStat.Stamina:
          return "icon-stamina";

        case CharacterStat.Energy:
          return "icon-energy";
      }

      return "";
    },
    handleAnimationReady() {
      this.ready = true;
      this.$nextTick(() => {
        this.$refs.fx.play();
        var state = this.$refs.animation.getState();
        state.setAnimation(0, "show", false);
        state.setAnimation(1, "loop", true);
      });
    }
  },
  computed: {
    trainingStats() {
      return (this.data.new - this.data.current) * 5;
    },
    meta() {
      const meta = {};
      for (let i = this.data.current; i < this.data.new; ++i) {
        const record = LevelUpMeta[i];
        for (const k in record) {
          if (Array.isArray(record[k])) {
            if (meta[k]) {
              let index = 0;
              for (const kk of record[k]) {
                meta[k][index].value += kk.value;
                index++;
              }
            } else {
              meta[k] = record[k];
            }
          } else {
            meta[k] = (meta[k] || 0) + record[k];
          }
        }
      }

      return meta;
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
  transform: translateY(-40%);
  position: absolute;
  width: 100rem;
  pointer-events: none;
  z-index: 1;
  height: 100rem;
}

.level-up-spacer {
  height: 30rem;
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
