<template>
  <div
    v-if="card"
    ref="card"
    class="march-card relative restrict-selection pointer"
    :class="{
      'march-card--pet': card.isPet,
      'march-card--adjacent': card.isAdjacent
    }"
    @click="clickHandler"
  >
    <div class="march-card-container absolute-stretch width-100 height-100">
      <div class="font-size-22">{{ card.unitClass }}</div>
      <div
        v-if="card.hp"
        class="march-card-hp absolute-bottom-left flex flex-center line-height-0 font-size-25 font-weight-700"
      >
        {{ card.hp }}
      </div>
      <div class="march-card-effects absolute-stretch width-100 height-100" />
    </div>
  </div>
</template>
<script>
import useSwipe from "@/helpers/useSwipe";
export default {
  props: {
    card: Object
  },
  data() {
    return {
      unregisterEvents: null
    };
  },
  computed: {
    canSwipe() {
      return this.card && this.card.canSwipe;
    }
  },
  watch: {
    canSwipe(value) {
      this.checkEvents(value);
    }
  },
  methods: {
    checkEvents(canSwipe) {
      if (canSwipe) {
        if (this.unregisterEvents) {
          return;
        }
        this.registerEvents();
      } else if (this.unregisterEvents) {
        this.unregisterEvents();
        this.unregisterEvents = null;
      }
    },

    registerEvents() {
      const {
        registerEvents: register,
        unregisterEvents: unregister
      } = useSwipe();
      register(this.$refs.card, this.swipeHandler);
      this.unregisterEvents = unregister;
    },

    swipeHandler(direction) {
      this.$emit("swipe", direction);
    },

    clickHandler(event) {
      if (!(this.card && this.card.canClick)) {
        return;
      }
      this.$emit("click", event);
    }
  },
  mounted() {
    this.checkEvents(this.canSwipe);
  },
  beforeDestroy() {
    if (this.unregisterEvents) {
      this.unregisterEvents();
      this.unregisterEvents = null;
    }
  }
};
</script>
<style scoped lang="less">
.march-card--pet .march-card-container {
  background-image: url("/images/march/pet1.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 60%;
}
.march-card-hp {
  background: #fff;
  border: 0.5rem solid #222;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  color: #222;
}
.march-card-effects {
  z-index: 1;
}
.march-card-effects::v-deep .march-arrow-effect {
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    // background: rgba(yellow, 0.5);
    background-image: url("/images/march/arrow.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 40%;
    z-index: 2;
  }
  &.march-arrow-effect--top {
    transform: rotate(-90deg);
  }
  &.march-arrow-effect--top::after {
    transform: rotate(-90deg);
  }
  &.march-arrow-effect--bottom::after {
    transform: rotate(90deg);
  }
  &.march-arrow-effect--left::after {
    transform: rotate(180deg);
  }
}
</style>
