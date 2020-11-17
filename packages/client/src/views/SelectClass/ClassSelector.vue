<template>
  <div class="flex flex-items-center flex-column">
    <span class="min-width-90 title font-size-20">{{ $t(className) }}</span>
    <div
      class="margin-top-2 relative selector-content"
      @click="select"
      :class="{ show: value == className }"
    >
      <div :class="classIcon"></div>
      <div class="params panel-dark relative margin-top-4">
        <div
          class="flex flex-column flex-center padding-bottom-1 padding-left-1 padding-right-1 padding-top-3"
        >
          <IconWithValue iconClass="icon-energy">
            <IconWithValue
              valueClass="font-size-15 blue-title"
              :flip="true"
              iconClass="icon-timer small"
              >{{ energyRegen }}</IconWithValue
            >
          </IconWithValue>
          <IconWithValue iconClass="icon-stamina">
            <IconWithValue
              valueClass="font-size-15 blue-title"
              :flip="true"
              iconClass="icon-timer small"
              >{{ staminaRegen }}</IconWithValue
            >
          </IconWithValue>
        </div>
        <div
          class="selector-border panel-selected"
          :class="{ show: value == className }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: { IconWithValue },
  props: ["classData", "value"],
  computed: {
    className() {
      return this.classData.name;
    },
    classIcon() {
      return this.classData.name;
    },
    energyRegen() {
      return this.convertToTime(this.classData.energyRegen);
    },
    staminaRegen() {
      return this.convertToTime(this.classData.staminaRegen);
    }
  },
  methods: {
    select() {
      this.$emit("input", this.classData.name);
    },
    convertToTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsLeft = seconds - minutes * 60;

      const minutesString = `${minutes}`.padStart(2, "0");
      const secondsString = `${secondsLeft}`.padStart(2, "0");

      return `${minutesString}:${secondsString}`;
    }
  }
};
</script>

<style lang="less" scoped>
@iconSize: 6rem;

.classIcon(@class) {
  background-image: url("../../assets/ui/@{class}.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: @iconSize;
  height: @iconSize;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.barbarian {
  .classIcon("class1");
}

.archer {
  .classIcon("class2");
}

.mage {
  .classIcon("class3");
}

.selector-border {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  transition: all 0.2s ease;
  opacity: 0;

  &.show {
    opacity: 1;
  }
}

.selector-content {
  transition: all 0.2s ease;
  opacity: 0.3;

  &.show {
    opacity: 1;
  }
}
</style>
