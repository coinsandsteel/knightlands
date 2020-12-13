<template>
  <div
    class="flex flex-column flex-center flex-items-center full-flex width-100 height-100 relative gacha-container"
  >
    <canvas
      class="canvas"
      ref="canvas"
      id="canvas"
      :class="{ hidden: hide }"
    ></canvas>

    <div class="close-btn" @click="goBack"></div>
    <Promised :promise="request">
      <template class="flex-full" v-slot:combined="{ isPending }">
        <loading-screen :loading="isPending"></loading-screen>
        <Flipper :flipKey="lootFlipKey">
          <h1
            class="chest-title font-weight-700"
            :class="[{ show: showLoot }, `chest-${chestId}`]"
          >
            {{ $t(`presale-chest-${chestId}`) }}
          </h1>

          <Flipped flipId="lootId" stagger="lootCard" :shouldFlip="isHidden()">
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
                  @hint="showHint"
                ></loot>
              </Flipped>
            </div>
          </Flipped>
        </Flipper>

        <div @click="handleContinue" class="continueButton"></div>

        <div
          class="gacha-continue pointer pointer-events-none"
          :class="{ show: showContinue }"
        >
          <span class="font-size-30 font-weight-700" v-if="hasMoreChests">{{
            $t("open_next")
          }}</span>
          <span v-else class="font-size-30 font-weight-700">{{
            $t("continue_from_gacha")
          }}</span>
        </div>
      </template>

      <template v-slot:rejected="error">
        <div class="full-flex flex flex-center">
          <p class="font-size-20 font-error">Unexpected error.</p>
          <custom-button @click="openGacha">Try again</custom-button>
        </div>
      </template>
    </Promised>
  </div>
</template>

<script>
import spine from "@/spine.js";
import Loot from "@/components/Loot.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/Button.vue";
import Config from "@/config";
import { Flipper, Flipped } from "vue-flip-toolkit";
import anime from "animejs/lib/anime.es.js";

import LootHint from "@/components/LootHint.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");

var lastFrameTime = Date.now() / 1000;
var canvas, context;
var assetManager;
var skeleton, state, bounds;
var skeletonRenderer;
var animName = "waiting";

const ChestSkeletons = {
  0: "brown",
  1: "blue",
  2: "red",
  3: "purple",
  4: "love"
};

export default {
  props: ["openToken", "chestId"],
  data: () => ({
    token: null,
    loot: {},
    request: null,
    showLoot: false,
    hasMoreChests: false,
    hide: false,
    showContinue: false
  }),
  components: { Loot, Promised, LoadingScreen, CustomButton, Flipper, Flipped },
  mounted() {
    this.$nextTick(() => {
      this.token = this.openToken;

      canvas = document.getElementById("canvas");
      context = canvas.getContext("2d");

      skeletonRenderer = new spine.canvas.SkeletonRenderer(context);
      // enable the triangle renderer, supports meshes, but may produce artifacts in some browsers
      skeletonRenderer.triangleRendering = false;

      assetManager = new spine.canvas.AssetManager();
      assetManager.loadText(`animations/${ChestSkeletons[this.chestId]}.json`);
      assetManager.loadText("animations/chests_anim.atlas.txt");
      assetManager.loadTexture("animations/chests_anim.png");

      requestAnimationFrame(this.load.bind(this));
    });
  },
  computed: {
    lootFlipKey() {
      return this.showLoot ? "true" : this.hide ? "hide" : "false";
    }
  },
  methods: {
    async showHint(item) {
      if (!item) {
        return;
      }

      await Hint(item, false, false);
    },
    handleContinue() {
      if (this.hasMoreChests) {
        this.openNext();
      } else {
        this.goBack();
      }
    },
    isHidden() {
      return (prev, current) => {
        return !this.hide;
      };
    },
    goBack() {
      this.$emit("continue");
    },
    async openNext() {
      // avoid double click
      if (!this.showContinue) {
        return;
      }

      this.showContinue = false;
      this.hide = true;

      const fadeDuration = 500;
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

      await this.openGacha();
    },
    async openGacha() {
      state.setAnimation(0, "idle", false);

      try {
        this.request = this.$game.signMessage(
          `${this.token}${this.$game.account}`
        );
        let signature = await this.request;

        this.request = this.$http.get(
          `${Config.httpEndpoint}/open/presaleChest`,
          {
            params: {
              wallet: this.$game.account,
              signature,
              chestId: this.chestId
            }
          }
        );
      } catch (exc) {
        this.goBack();
        return;
      }

      try {
        let response = await this.request;
        this.loot = response.body.loot;
        this.token = response.body.token;
        this.hasMoreChests = response.body.chestsLeft > 0;

        state.setAnimation(0, "open3", false);
        state.setAnimation(1, "waiting3", true);

        this.$emit("token", this.token);

        this.showContinue = true;
      } catch (exc) {
        console.log(exc);
      }
    },
    load() {
      if (assetManager.isLoadingComplete()) {
        var data = this.loadSkeleton(
          ChestSkeletons[this.chestId],
          animName,
          "default"
        );
        skeleton = data.skeleton;
        state = data.state;
        bounds = data.bounds;

        this.openGacha();

        requestAnimationFrame(this.render.bind(this));
      } else {
        requestAnimationFrame(this.load.bind(this));
      }
    },
    loadSkeleton(name, initialAnimation, skin) {
      if (skin === undefined) skin = "default";
      // Load the texture atlas using name.atlas and name.png from the AssetManager.
      // The function passed to TextureAtlas is used to resolve relative paths.
      let atlas = new spine.TextureAtlas(
        assetManager.get("animations/chests_anim.atlas.txt"),
        function(path) {
          return assetManager.get("animations/" + path);
        }
      );

      // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
      let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

      // Create a SkeletonJson instance for parsing the .json file.
      var skeletonJson = new spine.SkeletonJson(atlasLoader);
      // Set the scale to apply during parsing, parse the file, and create a new skeleton.
      var skeletonData = skeletonJson.readSkeletonData(
        assetManager.get("animations/" + name + ".json")
      );
      var skeleton = new spine.Skeleton(skeletonData);
      skeleton.scaleY = -1;

      // skeleton.scaleX = 2;
      bounds = this.calculateBounds(skeleton);
      skeleton.setSkinByName(skin);

      // Create an AnimationState, and set the initial animation in looping mode.
      var animationState = new spine.AnimationState(
        new spine.AnimationStateData(skeleton.data)
      );

      animationState.addListener({
        event: (trackIndex, event) => {
          // spawn loot
          if (event.data.name == "spawn_loot") {
            this.showLoot = true;
          }
        },
        complete: function(trackIndex, loopCount) {},
        start: function(trackIndex) {
          // console.log("Animation on track " + trackIndex + " started");
        },
        end: function(trackIndex) {
          console.log("Animation on track " + trackIndex + " ended");
        }
      });
      // Pack everything up and return to caller.
      return { skeleton: skeleton, state: animationState, bounds: bounds };
    },
    resize() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      if (canvas.width != w || canvas.height != h) {
        canvas.width = w;
        canvas.height = h;
      }
      // magic
      var centerX = bounds.offset.x + bounds.size.x / 2;
      var centerY = bounds.offset.y + bounds.size.y / 2;
      var scaleX = bounds.size.x / canvas.width;
      var scaleY = bounds.size.y / canvas.height;
      var scale = Math.max(scaleX, scaleY) * 1.2;

      if (scale < 1) scale = 1;

      var width = canvas.width * scale;
      var height = canvas.height * scale;

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(1 / scale, 1 / scale);
      context.translate(-centerX, h * 0.25);
      context.translate(width / 2, height / 2);
    },
    calculateBounds(skeleton) {
      var data = skeleton.data;
      skeleton.setToSetupPose();
      skeleton.updateWorldTransform();
      var offset = new spine.Vector2();
      var size = new spine.Vector2();
      skeleton.getBounds(offset, size, []);
      return { offset: offset, size: size };
    },
    render() {
      var now = Date.now() / 1000;
      var delta = now - lastFrameTime;
      lastFrameTime = now;
      this.resize();

      context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      // context.fillStyle = "#230e21";
      // context.fillRect(0, 0, canvas.width, canvas.height);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.restore();

      state.update(delta);
      state.apply(skeleton);
      skeleton.updateWorldTransform();
      skeletonRenderer.draw(skeleton);

      requestAnimationFrame(this.render.bind(this));
    }
  }
};
</script>

<style lang="less" scoped>
.canvas {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

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
  height: 35vh;
}

.gacha-container {
  pointer-events: all;
  position: absolute;
  z-index: 101;

  background: rgb(31, 11, 33);
  //linear-gradient(0deg, #3b1a6e 30%, #462347 55%, #462347 70%, #2d2136 95%)
  background: linear-gradient(
    0deg,
    #3b1a6e 30%,
    #462347 55%,
    #462347 70%,
    #2d2136 95%
  );
  height: 100vh;
  top: 0;
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
  opacity: 0;
  transition: all 0.2s ease;

  &.show {
    opacity: 1;
  }
}

.chest-3 {
  color: #be4bff;
}

.chest-2 {
  color: #f35672;
}

.chest-1 {
  color: #468fd4;
}

.chest-0 {
  color: #f37c35;
}

.close-btn {
  position: absolute;
  right: 2rem;
  top: 2rem;
  cursor: pointer;
}
</style>
