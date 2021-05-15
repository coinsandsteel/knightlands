<template>
  <div
    class="btn relative pointer"
    :class="[
      btnType,
      { disabled: disabled || locked },
      { lockPressed: lockPressed },
      { selected: selected },
      { mini: mini },
      { skewed: skewed },
      btnClass,
      { big: big }
    ]"
    :style="sizeStyle"
    @click="handleClick"
  >
    <!-- <div class="btn-fill" :class="{skewed: skewed}"></div> -->
    <div
      class="btn-content flex flex-center font-weight-700 flex-no-wrap"
      :class="fontClass"
    >
      <slot>{{ $t(caption) }}</slot>
    </div>
    <div v-if="locked" class="locked"></div>
    <SoundEffect ref="fx" :files="sounds" channel="ui" />
  </div>
</template>

<script>
import SoundEffect from "./SoundEffect.vue";

export default {
  props: {
    sounds: {
      type: Array,
      default() {
        return ["btn_click2"];
      }
    },
    type: {
      type: String,
      default: "red"
    },
    disabled: {
      type: Boolean
    },
    width: {
      type: String
    },
    minWidth: {
      type: String
    },
    cb: {
      type: Function
    },
    caption: {
      type: String
    },
    lockPressed: {
      type: Boolean,
      default: false
    },
    selected: Boolean,
    locked: Boolean,
    mini: Boolean,
    skewed: Boolean,
    btnClass: String,
    big: Boolean,
    fontClass: {
      type: String,
      default: "font-size-20"
    }
  },
  components: { SoundEffect },
  computed: {
    sizeStyle() {
      let style = "";

      if (this.width) {
        style += `width: ${this.width};`;
      }

      if (this.minWidth) {
        style += `min-width: ${this.minWidth};`;
      }

      return style;
    },
    btnType() {
      return this.skewed ? `${this.type}-skewed` : this.type;
    }
  },
  methods: {
    handleClick() {
      this.$refs.fx.play();
      this.$emit("click");
      if (this.cb) {
        this.cb();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../style/common.less";

@height: 4.2125rem;
@width: 5rem;
@fontSize: 1.6rem;

.pressed(@name) {
  // & > .btn-fill {
  //   background: url("../assets/ui/buttons/@{name}_active1.png"),
  //     url("../assets/ui/buttons/@{name}_active3.png");
  //   background-size: contain, contain;
  //   background-repeat: no-repeat, no-repeat;
  //   background-position: left, right;
  // }

  border-image-source: url("../assets/ui/@{name}_active.png");

  & > .btn-content {
    transform: translateY(0rem);
  }
}

.selected(@name) {
  // & > .btn-fill {
  //   background: url("../assets/ui/buttons/@{name}_selected1.png"),
  //     url("../assets/ui/buttons/@{name}_selected3.png");
  //   background-size: contain, contain;
  //   background-repeat: no-repeat, no-repeat;
  //   background-position: left, right;
  // }

  // background: repeat-x center url("../assets/ui/buttons/@{name}_selected2.png");
  // background-size: 100% 100%;

  // & > .btn-content {
  //   transform: translateY(0.1rem);
  // }
}

.btn-bg(@name) {
  &:active {
    .pressed(@name);
  }

  // & > .btn-fill {
  //   background: url("../assets/ui/buttons/@{name}1.png"),
  //     url("../assets/ui/buttons/@{name}3.png");
  //   background-size: contain, contain;
  //   background-repeat: no-repeat, no-repeat;
  //   background-position: left, right;
  // }

  border-image-source: url("../assets/ui/@{name}.png");
  border-image-slice: 50 70 50 70 fill;
  border-image-width: 20px 20px 20px 20px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: round round;
}

@btnFillExtrude: 3px;
@btnFillExtrudeSkewed: 1.6rem;

.btn-fill {
  height: 100%;
  width: calc(100% + @btnFillExtrude * 2);
  position: absolute;
  left: -@btnFillExtrude;
  top: 0;

  &.skewed {
    width: calc(100% + @btnFillExtrudeSkewed * 2);
    left: -@btnFillExtrudeSkewed;
  }
}

.btn {
  padding: 0 1rem;
  margin-left: @btnFillExtrude;
  margin-right: @btnFillExtrude;

  position: relative;
  min-width: @width;
  font-size: @fontSize;
  font-weight: 700;
  user-select: none;
  color: #4e3948;
  height: 5rem;

  &.big {
    height: 8rem;
  }

  &.mini {
    min-width: unset;
  }

  &.skewed {
    margin-left: @btnFillExtrudeSkewed;
    margin-right: @btnFillExtrudeSkewed;
  }

  & > .btn-content {
    height: 100%;
    transform: translateY(-0.2rem);
  }
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.skewed-stripes {
  // background: no-repeat url("./../assets/ui/buttons/skewed_button_glow.png");
  // background-repeat: no-repeat;
  // background-position: right;
  // background-size: contain;
  // position: absolute;
  // left: 0;
  // right: 0;
  // top: 0.25rem;
  // bottom: 0.7rem;
}

.locked {
  background: no-repeat url("./../assets/ui/icon_lock_big.png");
  width: 2.5rem;
  height: 2.5rem;
  background-size: contain;
  position: absolute;
  right: -1rem;
  top: -1rem;
}

.red {
  .btn-bg("button_red");

  &.lockPressed {
    .pressed("button_red");
  }
}

// .red-skewed {
//   .btn-bg("skewed_button_red");
// }

// .grey-skewed {
//   .btn-bg("skewed_button_blue");
// }

// .green-skewed {
//   .btn-bg("skewed_button_green");
// }

// .purple-skewed {
//   .btn-bg("skewed_button_purple");
// }

.blue {
  .btn-bg("button_blue");

  &.lockPressed {
    .pressed("button_blue");
  }
}

.green {
  .btn-bg("button_green");

  &.lockPressed {
    .pressed("button_green");
  }
}

.yellow {
  .btn-bg("button_yellow");

  &.lockPressed {
    .pressed("button_yellow");
  }
}

.grey {
  .btn-bg("button_pale");

  &.lockPressed {
    .pressed("button_pale");
  }

  &.selected {
    .selected("button_pale");
  }
}
</style>
