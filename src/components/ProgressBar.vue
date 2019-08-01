<template>
  <div class="progress-bar" :style="progressStyle()">
    <div class="icon">
      <div :class="iconClass"></div>
    </div>
    <div class="bar-container digit-font flex flex-center">
      <div class="bar" :style="barStyle()">
        <div class="progress" :class="progressType()" :style="fillStyle()"></div>
        <div
          class="status-bar-font bar-value flex flex-center"
          :class="[valueClass, valuePositionClass]"
        >
          <div v-show="showValue">{{currentValue}}</div>
          <div v-show="!showValue" class="status-bar-font flex">
            <div class="icon-timer icon-size-mini"></div>
            {{timerValue}}
          </div>
        </div>
      </div>
      <div v-if="plusButton" class="btn-plus" :class="`${plusButton}-btn`"></div>
    </div>
  </div>
</template>

<script>
const Inside = "inside";
const Top = "top";
const ToggleTimerInterval = 6000;

export default {
  props: {
    barColor: { default: "#ffffff44" },
    barType: { default: "red" },
    width: { default: "100%" },
    height: { default: "20px" },
    percentMode: { default: false },
    maxValue: { default: 100 },
    valueClass: { default: "" },
    iconClass: { type: String },
    hideMaxValue: { type: Boolean },
    value: { type: Number, default: 0 },
    timer: { type: Object },
    valuePosition: { type: String, default: Inside },
    plusButton: { type: String }, // possible values are grey, green, empty
    thresholds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      timerInterval: undefined,
      timerValue: "",
      timerShowInterval: undefined,
      showValue: true
    };
  },
  mounted() {
    this.updateTimerValue();
    this.toggleTimer();
  },
  computed: {
    valuePositionClass() {
      return this.valuePosition == Top ? "bar-value-top" : "";
    },
    currentValue() {
      let value = this.percentMode
        ? Math.floor((this.value / this.maxValue) * 100)
        : this.value;

      if (!this.hideMaxValue && !this.percentMode) {
        value += `/${this.maxValue}`;
      }

      if (this.percentMode) {
        value += "%";
      }

      return value;
    }
  },
  watch: {
    timer: {
      deep: true,
      handler() {
        this.updateTimerValue();
        this.toggleTimer();
      }
    }
  },
  methods: {
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

      let now = Math.floor(new Date().getTime() / 1000);
      let timeUntilNextPoint =
        this.timer.regenTime - (now - this.timer.lastRegenTime);
      let minutes = Math.floor(timeUntilNextPoint / 60);
      let seconds = timeUntilNextPoint % 60;
      let leadingZeroesForSeconds = seconds > 9 ? "" : 0;
      this.timerValue = `0${minutes}:${leadingZeroesForSeconds}${seconds}`;

      clearInterval(this.timerInterval);

      this.timerInterval = setInterval(() => {
        this.updateTimerValue();
      }, 1000);
    },
    progressType() {
      if (this.thresholds.length === 0) {
        return this.barType;
      }

      // iterate over threshold values and find apropriate style of bar
      let lowestThreshold = 99;
      let thresholdBarType = this.barType;
      let currentPercentValue = this.value / this.maxValue;
      if (currentPercentValue < 1) {
        let k = 0;
      }

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
        "background-color": this.barColor,
        height: "100%"
      };
    },
    fillStyle() {
      return {
        height: "100%",
        width: (this.value / this.maxValue) * 100 + "%"
      };
    },
    progressStyle() {
      return {
        width: this.width,
        height: this.height
      };
    }
  }
};
</script>


<style lang="less" scoped>
.progress-bar {
  position: relative;
  display: flex;
  align-items: center;

  .bar-container {
    width: 100%;
    height: 100%;
    position: relative;

    .bar {
      flex: 1;
      position: relative;

      .progress {
        transition: width 0.2s ease;
      }
    }
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

.bar-value {
  color: #210028;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.bar-value-top {
  bottom: 100%;
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
</style>
