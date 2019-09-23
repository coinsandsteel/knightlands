<template>
  <div class="flex flex-no-wrap font-size-18 flex-center digit-font flex-space-between">
    <i
      :class="{'disabled-btn':!decreaseCondition}"
      class="pointer att-minus"
      @click="decreaseAttribute"
      @mousedown="startAttributeDecrease"
      @mouseleave="stopAttributeModify"
      @mouseup.prevent="stopAttributeModify"
      @touchstart="startAttributeDecrease"
      @touchend="stopAttributeModify"
      @touchcancel="stopAttributeModify"
    ></i>
    <slot name="between">
      <span class="font-size-20 att-name" v-if="caption">{{caption}}</span>
      <span class="font-size-20 att-value" v-if="showMax">{{value}}/{{maxValue}}</span>
      <span class="font-size-20 att-value" v-else>{{value}}</span>
    </slot>
    <i
      :class="{'disabled-btn' : !increaseCondition}"
      class="pointer att-plus"
      @click="increaseAttribute"
      @mousedown="startAttributeIncrease"
      @mouseleave="stopAttributeModify"
      @mouseup.prevent="stopAttributeModify"
      @touchstart="startAttributeIncrease"
      @touchend="stopAttributeModify"
      @touchcancel="stopAttributeModify"
    ></i>
    <slot></slot>
  </div>
</template>

<script>
const ContinuousEditingTimeout = 500;

export default {
  props: [
    "decreaseCondition",
    "increaseCondition",
    "value",
    "maxValue",
    "caption",
    "showMax"
  ],
  methods: {
    increaseAttribute() {
      if (!this.increaseCondition) {
        return false;
      }

      this.$emit("inc");
      return true;
    },
    decreaseAttribute(attr) {
      if (!this.decreaseCondition) {
        return false;
      }

      this.$emit("dec");
      return true;
    },
    startAttributeDecrease() {
      this.modifyAttributeLongPress(4, -1);
    },
    startAttributeIncrease() {
      this.modifyAttributeLongPress(4, 1);
    },
    modifyAttributeLongPress(pointsPerSecond, stepValue) {
      this.longPressAttributeModificationTimeout = setTimeout(() => {
        this.modifyAttributeLongPress(pointsPerSecond * 2, stepValue);
        this.modifyAttributeContinuously(pointsPerSecond, stepValue);
      }, ContinuousEditingTimeout);
    },
    modifyAttributeContinuously(speed, stepValue) {
      if (this.attributeModificationInterval) {
        clearInterval(this.attributeModificationInterval);
      }

      this.attributeModificationInterval = setInterval(() => {
        let result = false;
        if (stepValue < 0) {
          result = this.decreaseAttribute();
        } else {
          result = this.increaseAttribute();
        }

        if (!result) {
          this.stopAttributeModify();
        }
      }, 1000 / speed);
    },
    stopAttributeModify() {
      if (this.longPressAttributeModificationTimeout) {
        clearTimeout(this.longPressAttributeModificationTimeout);
        this.longPressAttributeModificationTimeout = undefined;
      }

      if (this.attributeModificationInterval) {
        clearInterval(this.attributeModificationInterval);
        this.attributeModificationInterval = undefined;
      }
    }
  }
};
</script>


<style lang="less" scoped>
.att-name {
  width: 20%;
  // text-align: right;
}

.att-value {
  width: 30%;
  // text-align: right;
}

.disabled-btn {
  opacity: 0.3;
  pointer-events: none;
}

.att-btn(@filename) {
  background-image: url("../assets/ui/@{filename}.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: 2rem;
  height: 2rem;
}

.att-plus {
  .att-btn("button_plus_training_camp");
}

.att-minus {
  .att-btn("button_minus_training_camp");
}
</style>
