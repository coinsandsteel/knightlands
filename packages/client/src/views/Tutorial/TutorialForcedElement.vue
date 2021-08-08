<template>
  <div class="absolute-stretch flex flex-column" ref="root" v-show="element">
    <template v-if="start">
      <div class="focus-mask e d" :style="topStyle"></div>
      <div class="focus-mask e d" :style="bottomStyle"></div>
      <div class="focus-mask e d" :style="leftStyle"></div>
      <div class="focus-mask e d" :style="rightStyle"></div>
      <div
        class="focus-mask e pointer"
        :style="centerStyle"
        @click="handleClick"
      ></div>
    </template>
    <div v-else class="absolute-stretch"></div>

    <div class="t-circle" v-show="start" ref="circle"></div>
    <div class="t-pointer" v-show="start" ref="pointer"></div>

    <div
      class="flex flex-column flex-center stuck-dialog e color-panel-1"
      v-if="showSkipButton"
    >
      <span class="font-size-30 margin-bottom-2">
        {{ $t("got-stuck") }}
      </span>
      <CustomButton height="3rem" type="red" @click="$emit('skip')">
        {{ $t("btn-skip-t") }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
import UI from "@/ui_constants";
import anime from "animejs/lib/anime.es.js";
import CustomButton from "@/components/Button.vue";

const SKIP_TIMEOUT = 4000;

const DEFAULT_OFFSET = {
  left: 0,
  top: 0
};

export default {
  props: ["data"],
  data: () => ({
    selfBB: null,
    element: null,
    start: false,
    updStep: 0,
    showSkipButton: false
  }),
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler() {
        if (this.data) {
          this.show();
        }
      }
    }
  },
  components: { CustomButton },
  computed: {
    elementId() {
      if (!this.data) {
        return null;
      }
      return this.data.target;
    },
    pointerPosition() {
      const elPos = { ...this.elementPosition };

      if (!this.elementOnTheLeft()) {
        elPos.left -= this.$refs.pointer.clientWidth * 0.5;
      }
      // elPos.top -= this.$refs.pointer.clientHeight / 2;

      return elPos;
    },
    circlePosition() {
      const elPos = { ...this.elementPosition };

      if (this.updStep == 0) {
        // if (this.elementOnTheLeft()) {
        //   elPos.left -= 20;
        // } else {
        //   elPos.left += 20;
        // }
        // console.log(elPos, this.$refs.circle.clientWidth);
      }

      // elPos.top -= this.$refs.circle.clientHeight / 2;
      return elPos;
    },
    elementPosition() {
      if (!this.element || this.updStep == -1) {
        return {};
      }

      const el = this.elementBB;
      const frame = this.selfBB;

      return {
        top: el.top - frame.top + el.height / 2,
        left: el.left - frame.left + el.width / 2
      };
    },
    elementBB() {
      if (!this.element || this.updStep == -1) {
        return DEFAULT_OFFSET;
      }

      const offset = UI.offsetAbsolute(this.element);
      return offset;
    },
    left() {
      const frame = this.selfBB;
      const bb = this.elementBB;
      return bb.left + bb.width - frame.left;
    },
    right() {
      const frame = this.selfBB;
      const bb = this.elementBB;
      return this.selfBB.width - bb.left + frame.left;
    },
    bottom() {
      const bb = this.elementBB;
      return this.selfBB.height - bb.top;
    },
    top() {
      const bb = this.elementBB;
      return bb.top + bb.height;
    },
    centerStyle() {
      if (!this.element) {
        return {};
      }

      const bb = this.elementBB;
      const frame = this.selfBB;

      return {
        top: `${this.top - bb.height}px`,
        left: `${bb.left - frame.left}px`,
        right: `${this.selfBB.width + frame.left - (bb.left + bb.width)}px`,
        bottom: `${this.bottom - bb.height}px`
      };
    },
    topStyle() {
      if (!this.element) {
        return {};
      }

      const bb = this.elementBB;
      const frame = this.selfBB;

      return {
        top: 0,
        left: `${bb.left - frame.left}px`,
        right: `${this.selfBB.width + frame.left - (bb.left + bb.width)}px`,
        bottom: `${this.bottom}px`
      };
    },
    bottomStyle() {
      if (!this.element) {
        return {};
      }

      const bb = this.elementBB;
      const frame = this.selfBB;

      return {
        top: `${this.top}px`,
        left: `${bb.left - frame.left}px`,
        right: `${this.selfBB.width + frame.left - (bb.left + bb.width)}px`,
        bottom: 0
      };
    },
    leftStyle() {
      if (!this.element) {
        return {};
      }

      return {
        top: 0,
        right: `${this.right}px`,
        left: 0,
        bottom: 0
      };
    },
    rightStyle() {
      if (!this.selfBB) {
        return {};
      }

      return {
        top: 0,
        left: `${this.left}px`,
        right: 0,
        bottom: 0
      };
    }
  },
  methods: {
    elementOnTheLeft() {
      if (!this.selfBB || !this.element) {
        return {};
      }

      const el = this.elementBB;
      const frame = this.selfBB;

      return el.left <= frame.left + frame.width / 2;
    },
    handleClick(e) {
      this.$emit("continue");

      let element = this.element;
      this.$nextTick(() => {
        element.click();
        this.hide();
      });
    },
    hide() {
      if (this.animation) {
        this.animation.timelineCircle.pause();
        this.animation.timelineCircle.reset();
        this.animation.timelinePointer.reset();
        this.animation.timelinePointer.reset();
        this.animation = null;
      }

      if (this.delayedAnimation) {
        clearTimeout(this.delayedAnimation);
        this.delayedAnimation = null;
      }

      if (this.posInterval) {
        clearInterval(this.posInterval);
        this.posInterval = null;
      }

      if (this.searchInterval) {
        clearInterval(this.searchInterval);
        this.searchInterval = null;
      }

      if (this.skipTimeout) {
        clearTimeout(this.skipTimeout);
        this.skipTimeout = null;
      }

      this.updStep = 0;
      this.element = null;
      this.start = false;
      this.showSkipButton = false;
    },
    show() {
      this.$nextTick(() => {
        let found = false;
        this.searchInterval = setInterval(() => {
          this.element = document.querySelector(this.elementId);
          if (!found && this.element) {
            found = true;
            this.$nextTick(() => {
              this.selfBB = UI.offsetAbsolute(this.$el);
            });

            setTimeout(() => {
              this.start = true;
              this.skipTimeout = setTimeout(() => {
                this.showSkipButton = true;
              }, SKIP_TIMEOUT);

              this.$nextTick(() => {
                this.animation = this.loop();
              });
            }, this.data.delay || 1);
          }
        }, 100);
      });
    },
    loop() {
      this.posInterval = setInterval(() => {
        this.selfBB = UI.offsetAbsolute(this.$el);

        this.updStep++;

        anime.set(this.$refs.circle, {
          ...this.circlePosition
        });

        anime.set(this.$refs.pointer, {
          ...this.pointerPosition
        });
      }, 250);

      anime.set(this.$refs.circle, {
        ...this.circlePosition,
        width: "1rem",
        height: "1rem",
        opacity: 0
      });

      const timelineCircle = anime.timeline({
        targets: this.$refs.circle,
        loop: true,
        duration: 3000,
        autoplay: false
      });

      anime.set(this.$refs.pointer, {
        ...this.pointerPosition,
        opacity: 0
      });

      anime.set(this.$refs.pointer, {
        opacity: 1,
        rotateZ: `${this.elementOnTheLeft() ? "350deg" : "70deg"}`
      });

      const timelinePointer = anime.timeline({
        targets: this.$refs.pointer,
        loop: true
      });

      timelinePointer.add({
        easing: "easeInExpo",
        // top: [
        //   this.pointerPosition.top - POINTER_HOVER_HEIGHT,
        //   this.pointerPosition.top
        // ],
        duration: 750,
        delay: 750,
        scale: 0.7
      });

      timelinePointer.add({
        easing: "easeOutBack",
        // top: this.pointerPosition.top + POINTER_HOVER_HEIGHT,
        duration: 750,
        endDelay: 750,
        scale: 1
      });

      this.delayedAnimation = setTimeout(() => {
        this.delayedAnimation = null;
        timelineCircle.add(
          {
            easing: "easeOutCirc",
            scale: "18"
          },
          0
        );

        timelineCircle.add(
          {
            duration: 1000,
            opacity: [1, 0],
            easing: "easeOutExpo"
          },
          500
        );

        timelineCircle.play();
      }, 1500);

      return {
        timelineCircle,
        timelinePointer
      };
    }
  }
};
</script>

<style lang="less" scoped>
.stuck-dialog {
  z-index: 151;
}

.focus-mask {
  z-index: 99;
  position: absolute;
}

.d {
  background-color: #2100287e;
}

.e {
  pointer-events: all;
}

.t-pointer {
  position: absolute;
  background-image: url("../../assets/ui/tut_cursor.png");
  background-repeat: no-repeat;
  background-size: contain;
  width: 5rem;
  height: 5rem;
  z-index: 101;
}

.t-circle {
  position: absolute;
  background-image: url("../../assets/ui/tut_circle1.png");
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 100;
}
</style>
