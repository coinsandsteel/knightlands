<template>
  <div
    class="flex flex-column flex-center flex-items-center full-flex width-100 height-100 relative gacha-container"
    :class="chest"
  >
    <SpinePlayer
      class="canvas"
      ref="animation"
      :binary="true"
      :skeletonFile="chestSkeleton"
      :skeletonName="chestSkeleton"
      atlas="chests_anim"
      atlasImage="chests_anim"
      @ready="handleAnimationReady"
      :class="{ hidden: hide }"
    ></SpinePlayer>

    <SoundEffect ref="chestFx" :files="['chest1', 'chest2']" channel="fx" />
    <SoundEffect ref="itemsFx" :files="['chest_items']" channel="fx" />

    <div class="close-btn" @click="handleBackButton"></div>
    <Promised :promise="request">
      <template
        class="flex-full"
        v-slot:combined="{ isDelayOver, isPending, error }"
      >
        <loading-screen :loading="isDelayOver && isPending"></loading-screen>

        <template v-if="error">
          <div class="full-flex flex flex-center">
            <p class="font-size-20 font-error">Unexpected error.</p>
            <custom-button @click="openGacha">Try again</custom-button>
          </div>
        </template>
        <template v-else>
          <div @click="handleContinue" class="continueButton"></div>

          <Flipper :flipKey="lootFlipKey">
            <!-- <h1
            class="chest-title font-weight-700"
            :class="[{'show': showLoot},`chest-${chest}`]"
            >{{$t(chest)}}</h1>-->

            <Flipped
              flipId="lootId"
              stagger="lootCard"
              :shouldFlip="isHidden()"
            >
              <div
                id="loot-container"
                class="flex flex-center gacha-loot"
                :class="{ expanded: showLoot }"
              >
                <Flipped
                  stagger="lootCard"
                  :shouldFlip="isHidden()"
                  v-for="drop in loot"
                  :key="drop.item"
                  :flipId="`${drop.item}`"
                  inverseFlipId="lootId"
                  translate
                >
                  <loot
                    :gacha="true"
                    :item="drop.item"
                    :quantity="drop.quantity"
                    @hint="handleHint"
                  ></loot>
                </Flipped>
              </div>
            </Flipped>
          </Flipper>

          <div
            class="gacha-continue pointer pointer-events-none"
            :class="{ show: showContinue }"
          >
            <!-- <span class="font-size-30 font-weight-700" v-if="hasMoreChests">{{$t("open_next")}}</span> -->
            <span class="font-size-30 font-weight-700">{{
              $t("continue_from_gacha")
            }}</span>
          </div>
        </template>
      </template>
    </Promised>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Loot from "@/components/Loot.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/Button.vue";
import { Flipper, Flipped } from "vue-flip-toolkit";
import anime from "animejs/lib/anime.es.js";
import SpinePlayer from "@/components/SpinePlayer.vue";
import HintHandler from "@/components/HintHandler.vue";
import ChestsMeta from "@/metadata/chests_meta";
import SoundEffect from "@/components/SoundEffect.vue";

const ChestSkeletons = {
  wooden_chest: "small",
  silver_chest: "medium",
  velvet_chest: "large",
  halloween_chest: "halloween"
};

export default {
  mixins: [AppSection, HintHandler],
  props: ["chest", "items", "count"],
  data: () => ({
    loot: [],
    request: null,
    showLoot: false,
    hide: false,
    showContinue: false
  }),
  components: {
    SoundEffect,
    Loot,
    Promised,
    LoadingScreen,
    CustomButton,
    Flipper,
    Flipped,
    SpinePlayer
  },
  created() {
    this.$options.useRouterBack = true;
  },
  activated() {
    if (this.$refs.animation.isReady()) {
      this.startGacha();
    }
  },
  deactivated() {
    this.showLoot = false;
  },
  computed: {
    lootFlipKey() {
      return this.showLoot ? "true" : this.hide ? "hide" : "false";
    },
    chestSkeleton() {
      return ChestSkeletons[this.chest];
    },
    hasMoreChests() {
      let key = ChestsMeta[this.chest].keyItem;
      return this.$game.inventory.getItemsCountByTemplate(key) > 0;
    }
  },
  methods: {
    startGacha() {
      if (this.items) {
        this.loot = this.items;

        if (this.showContinue) {
          this.request = this.openNext();
        } else {
          this.request = this.startOpening();
        }
      } else if (this.$refs.animation.isReady()) {
        if (this.showContinue) {
          this.openNext();
        } else {
          this.openGacha();
        }
      }
    },
    handleContinue() {
      this.handleBackButton();
    },
    handleAnimationReady() {
      this.$refs.animation.getState().addListener({
        event: (trackIndex, event) => {
          // spawn loot
          if (event.data.name == "spawn_loot") {
            this.showLoot = true;
            this.showContinue = true;
            this.$refs.itemsFx.play();
          }
        }
      });

      this.$nextTick(() => {
        this.startGacha();
      });
    },
    isHidden() {
      return (prev, current) => {
        return !this.hide;
      };
    },
    async openNext() {
      // avoid double click
      if (!this.showContinue) {
        return;
      }

      this.showContinue = false;
      this.hide = true;

      const fadeDuration = 0;
      let timeline = anime.timeline({
        duration: fadeDuration,
        easing: "easeOutCubic"
      });

      timeline.add({
        targets: ".chest-title",
        opacity: 0
      });

      timeline.add(
        {
          targets: "#loot-container",
          translateY: "5rem",
          opacity: 0
        },
        0
      );

      await timeline.finished;

      this.showLoot = false;
      this.hide = false;

      if (this.items) {
        this.startOpening();
      } else {
        this.openGacha();
      }
    },
    async openGacha() {
      let state = this.$refs.animation.getState();
      state.setAnimation(0, "idle", false);

      this.request = this.$game.openChest(this.chest, null, this.count || 1);

      try {
        this.loot = await this.request;

        this.$app.logEvent("summon-chest", {
          chest: this.chest,
          count: this.count
        });

        this.startOpening();
      } catch (exc) {
        console.log(exc);
      }
    },
    async startOpening() {
      let state = this.$refs.animation.getState();
      this.$refs.chestFx.play();
      state.setAnimation(0, "open3", false);
      state.setAnimation(1, "waiting3", true);
    }
  }
};
</script>

<style lang="less" scoped>
.canvas {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transform: translateY(25%);

  opacity: 1;
  transition: all 0.2s ease-out;

  &.hidden {
    opacity: 0;
  }
}

.loop(@counter) when (@counter >= 0) {
  .loop((@counter - 1)); // next iteration
  & :nth-child(@{counter}) {
    transition-delay: 0.07s * @counter;
  }
}

.gacha-loot {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 30rem;

  & > * {
    margin: 1rem;
    grid-column: 1;
    grid-row: 1;
    opacity: 0;
    transition: opacity 0.4s ease-in;
  }

  display: grid;

  &.expanded {
    display: flex;
    position: inherit;
    margin: 0 auto;

    & > * {
      opacity: 1;
    }

    .loop(15);
  }
}

.continueButton {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100vh;
  left: 0;
  right: 0;
}

.gacha-container {
  pointer-events: all;
  position: absolute;
  z-index: 101;
  height: 100vh;
  top: 0;

  &.wooden_chest {
    background: rgb(193, 136, 64);
    background: linear-gradient(
      0deg,
      rgba(193, 136, 64, 1) 0%,
      rgba(74, 0, 90, 1) 100%
    );
  }

  &.silver_chest {
    background: rgb(63, 157, 186);
    background: linear-gradient(
      0deg,
      rgba(63, 157, 186, 1) 0%,
      rgba(74, 0, 90, 1) 100%
    );
  }

  &.velvet_chest {
    background: rgb(184, 29, 116);
    background: linear-gradient(
      0deg,
      rgba(184, 29, 116, 1) 0%,
      rgba(74, 0, 90, 1) 100%
    );
  }

  &.halloween_chest {
    background: #7bce5d;
    background: linear-gradient(0deg, #7bce5d 0%, #623b9f 100%);
  }
}

.chest-title {
  opacity: 0;
  // transition: all 0.2s ease;
  margin-top: -15vh;

  &.show {
    opacity: 1;
  }
}

.gacha-continue {
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  width: 100%;
  opacity: 0;
  transition: all 0.2s ease;

  &.show {
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  right: 2rem;
  top: 2rem;
  cursor: pointer;
}
</style>
