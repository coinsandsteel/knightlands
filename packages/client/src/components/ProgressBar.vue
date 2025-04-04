<template>
  <div
    class="progress-bar flex flex-center flex-no-wrap"
    @click="$emit('refill')"
    :class="{ 'width-100': expand }"
  >
    <div class="icon">
      <div :class="iconClass"></div>
    </div>

    <div
      class="bar-container status-bar-font flex flex-center"
      :class="[{ 'flex-column': isTop }, barClasses]"
      :style="{ width: width }"
    >
      <div
        class="bar-value flex flex-center font-weight-700 bar-value-top"
        :class="valueClass"
        v-if="!hideValues && isTop"
      >
        <slot name="label"></slot>
        <div v-show="showValue">{{ currentValue }}</div>
        <div v-show="!showValue" class="flex">
          <div class="icon-timer small"></div>
          <span>{{ timerValue.value }}</span>
        </div>
        <slot name="after-label"></slot>
      </div>

      <div class="bar" :style="barStyle()" :class="{ top: isTop }">
        <div
          v-if="!hideMainBar"
          class="progress"
          :class="progressType()"
          :style="fillStyle()"
        ></div>
        <div
          v-if="!hideMainBar"
          class="progress-delta"
          :style="deltaFillStyle()"
          :class="{ show: valueChanged }"
        ></div>
        <div
          v-if="value2 > 0"
          class="progress progress2"
          :class="barType2"
          :style="fillStyle2()"
        ></div>

        <div
          class="bar-value flex flex-center font-weight-700"
          :class="valueClass"
          v-if="!hideValues && !isTop"
        >
          <div class="flex flex-center" :class="labelClass">
            <slot name="label"></slot>
            <div v-show="showValue">{{ currentValue }}</div>
            <div v-show="!showValue" class="status-bar-font flex flex-center">
              <div class="icon-timer small"></div>
              <span>{{ timerValue.value }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="plusButton"
        class="btn-plus pointer"
        :class="`${plusButton}-btn`"
      ></div>
    </div>
  </div>
</template>

<script>
import Timer from "@/timer.js";
import debounce from "lodash.debounce";

const Inside = "inside";
const Top = "top";
const ToggleTimerInterval = 6000;

export default {
  props: {
    barColor: { default: "#ffffff44" },
    barType: { default: "red" },
    barType2: { default: "red" },
    width: { default: "100%" },
    height: { default: "2rem" },
    percentMode: { default: false },
    maxValue: { default: 100 },
    valueClass: { default: "" },
    iconClass: { type: String },
    hideMaxValue: { type: Boolean },
    abbreviate: { type: Boolean, default: false },
    value: { type: [Number, String], default: 0 },
    value2: { type: [Number, String], default: 0 },
    timer: { type: Object },
    valuePosition: { type: String, default: Inside },
    plusButton: { type: String }, // possible values are grey, green, empty
    thresholds: {
      type: Array,
      default: () => []
    },
    barClasses: String,
    compact: Boolean,
    hideValues: Boolean,
    hideMainBar: Boolean,
    hideBackground: Boolean,
    expand: {
      type: Boolean,
      default: true
    },
    labelClass: { type: String }
  },
  data() {
    return {
      timerValue: new Timer(),
      timerShowInterval: undefined,
      showValue: true,
      previousValue: 0
    };
  },
  mounted() {
    this.updateTimerValue();
    this.toggleTimer();
  },
  created() {
    this._removeBlink = debounce(
      () => {
        this.previousValue = this.value;
      },
      1000,
      { leading: false, trailing: true }
    );
  },
  computed: {
    valueChanged() {
      return this.previousValue != this.value;
    },
    isTop() {
      return this.valuePosition == Top;
    },
    currentValue() {
      let useValue = this.value2 ? this.value2 : this.value;
      let value = this.percentMode
        ? Math.floor((useValue / this.maxValue) * 100)
        : useValue;

      let maxValue = this.maxValue;
      if (this.abbreviate) {
        value = this.abbreviateNumber(value);
        maxValue = this.abbreviateNumber(maxValue);
      }

      if (!this.hideMaxValue && !this.percentMode) {
        value += `/${maxValue}`;
      }

      if (this.percentMode) {
        value += "%";
      }

      return value;
    }
  },
  watch: {
    value: {
      immediate: false,
      handler(newValue, oldValue) {
        this.previousValue = newValue;
        this.$nextTick(() => {
          this.previousValue = oldValue;
          this._removeBlink();
        });
      }
    },
    timer: {
      deep: true,
      handler() {
        this.updateTimerValue();
        this.toggleTimer();
      }
    }
  },
  methods: {
    abbreviateNumber(value) {
      let newValue = value;
      const suffixes = ["", "K", "M", "B", "T", "QV", "QN", "S"];
      let suffixNum = 0;
      while (newValue >= 1000) {
        newValue /= 1000;
        suffixNum++;
      }
      newValue = newValue.toPrecision(3);
      newValue += suffixes[suffixNum];
      return newValue;
    },
    toggleTimer() {
      if (!this.timer) {
        return;
      }

      clearInterval(this.timerShowInterval);

      if (this.value >= this.maxValue) {
        this.showValue = true;
        return;
      }

      this.timerShowInterval = setInterval(() => {
        this.showValue = !this.showValue;
      }, ToggleTimerInterval);
    },
    updateTimerValue() {
      if (!this.timer || this.value >= this.maxValue) {
        return;
      }

      this.timerValue.timeLeft =
        this.timer.regenTime -
        (this.$game.now / 1000 - this.timer.lastRegenTime);
    },
    progressType() {
      if (this.thresholds.length === 0) {
        return this.barType;
      }

      // iterate over threshold values and find apropriate style of bar
      let lowestThreshold = 99;
      let thresholdBarType = this.barType;
      let currentPercentValue = this.value / this.maxValue;

      for (let i = 0; i < this.thresholds.length; i++) {
        let threshold = this.thresholds[i];
        if (lowestThreshold <= threshold.value) {
          continue;
        }

        if (currentPercentValue <= threshold.value) {
          lowestThreshold = threshold.value;
          thresholdBarType = threshold.type;
        }
      }

      return thresholdBarType;
    },
    setValue(value) {
      // v-model support
      this.$emit("input", value);
    },
    barStyle() {
      return {
        "background-color": this.hideBackground ? "#0000" : this.barColor,
        height: this.compact ? "0.75rem" : this.height
      };
    },
    fillStyle() {
      let percentWidth = (this.value / this.maxValue) * 100;
      if (percentWidth > 100) {
        percentWidth = 100;
      }
      return {
        height: "100%",
        width: percentWidth + "%"
      };
    },
    fillStyle2() {
      let percentWidth = (this.value2 / this.maxValue) * 100;
      if (percentWidth > 100) {
        percentWidth = 100;
      }
      return {
        height: "100%",
        width: percentWidth + "%"
      };
    },
    progressStyle() {
      return {
        height: this.height
      };
    },
    deltaFillStyle() {
      let percentWidth = (this.previousValue / this.maxValue) * 100;
      if (percentWidth > 100) {
        percentWidth = 100;
      }
      return {
        width: percentWidth + "%"
      };
    }
  }
};
</script>

<style lang="less" scoped>
.progress-bar {
  z-index: 1;
  position: relative;

  .bar-container {
    width: 100%;
    height: 100%;
    position: relative;

    .bar {
      width: 100%;
      z-index: -1;
      flex: 1;
      position: relative;

      &.top {
        flex-basis: unset;
      }

      .progress {
        transition: width 0.2s ease;
        z-index: 1;
      }

      .progress-delta {
        z-index: -1;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: #d7f1ff;
        opacity: 0;

        &.show {
          animation: delta 1s linear;
        }
      }

      .progress2 {
        z-index: -1;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
      }
    }

    &.no-animation {
      .progress {
        transition: none;
      }
      .progress-delta {
        &.show {
          animation: none;
        }
      }
    }
  }
}

@keyframes delta {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.btn-plus {
  background-image: url("../assets/ui/button_plus_status_bar.png");
  background-size: contain;
  width: 2rem;
  height: 2rem;

  &.green-btn {
    background-color: #70ee70;
  }
}

.red {
  border-image: url("../assets/ui/progress_bar_tall_red.png") repeat;
  border-image-slice: 1 fill;
  border-image-width: 3px;
}

.yellow {
  border-image: url("../assets/ui/progress_bar_tall_yellow.png") repeat;
  border-image-slice: 1 fill;
  border-image-width: 3px;
}

.grey {
  border-image: url("../assets/ui/progress_bar_tall_white.png") repeat;
  border-image-slice: 1 fill;
  border-image-width: 3px;
}

.blue {
  border-image: url("../assets/ui/progress_bar_tall_blue.png") repeat;
  border-image-slice: 1 fill;
  border-image-width: 3px;
}

.green {
  border-image: url("../assets/ui/progress_bar_tall_green.png") repeat;
  border-image-slice: 1 fill;
  border-image-width: 3px;
}

.green-h {
  border-image: url("../assets/ui/progress_bar_halloween.png") repeat;
  border-image-slice: 1 fill;
  border-image-width: 3px;
}

.bar-value {
  color: #210028;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}

.bar-value-top {
  position: unset;
}

.timer {
  position: absolute;
  top: 0;
  left: 0;
  top: 0;
  right: 0;
}

.icon {
  position: relative;
}
.label-panel {
  padding: 0.1em 0.4em;
  background: rgba(0, 0, 0, 0.25);
}

.xmas-bg {
  border-image: url("../assets/xmas/progress_bar_bg.png") repeat;
  border-image-slice: 6 fill;
  border-image-width: 6px;
}
</style>
