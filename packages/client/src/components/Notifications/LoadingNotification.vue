<template>
  <notifications
    animation-type="velocity"
    :animation="animation"
    group="loading"
    position="top"
    width="inherit"
    height="100%"
  >
    <template slot="body" slot-scope="props">
      <div class="full-height">
        <div class="flex flex-center loading padding-2 relative">
          <div class="bg-color"></div>
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="loaders/03_Fade Circles/JSON/07_white.json"
            style="width: 64px; height: 64px;"
          >
          </lottie-player>
          <span class="font-size-30 relative margin-left-2">{{
            $t("loading")
          }}</span>
        </div>
      </div>
    </template>
  </notifications>
</template>

<script>
import * as LottiePlayer from "@lottiefiles/lottie-player";

export default {
  computed: {
    animation() {
      return {
        /**
         * Animation function
         *
         * Runs before animating, so you can take the initial height, width, color, etc
         * @param  {HTMLElement}  element  The notification element
         */
        enter() {
          return {
            // animates from 0 to random opacity (in range between 0.5 and 1)
            opacity: 1
          };
        },
        leave: {
          height: 0,
          opacity: 0
        }
      };
    }
  }
};
</script>

<style lang="less" scoped>
.bg-color {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #210028;
  opacity: 0.75;
}

.full-height {
  height: 100vh;
}
</style>
