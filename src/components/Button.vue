<template>
  <div
    class="btn"
    :class="[type, {disabled:disabled}, {lockPressed: lockPressed}, {selected: selected}]"
    :style="sizeStyle"
    @click="()=>{$emit('click'); if (cb) cb();}"
  >
    <div class="btn-fill"></div>
    <div class="btn-content">
      <slot>{{caption}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    selected: Boolean
  },
  computed: {
    sizeStyle() {
      if (!this.width || this.width == "") {
        return "";
      }

      return `width: ${this.width}`;
    }
  }
};
</script>


<style lang="less" scoped>
@import (reference) "../style/common.less";

@height: 4.2125rem;
@width: 10.875rem;
@fontSize: 1.6rem;

.pressed(@name) {
  & > .btn-fill {
    background: url("../assets/ui/buttons/@{name}_active1.png"),
      url("../assets/ui/buttons/@{name}_active3.png");
    background-size: contain, contain;
    background-repeat: no-repeat, no-repeat;
    background-position: left, right;
  }

  background: repeat-x center url("../assets/ui/buttons/@{name}_active2.png");
  background-size: 100% 100%;

  & > .btn-content {
    transform: translateY(0.1rem);
  }
}

.selected(@name) {
  & > .btn-fill {
    background: url("../assets/ui/buttons/@{name}_selected1.png"),
      url("../assets/ui/buttons/@{name}_selected3.png");
    background-size: contain, contain;
    background-repeat: no-repeat, no-repeat;
    background-position: left, right;
  }

  background: repeat-x center url("../assets/ui/buttons/@{name}_selected2.png");
  background-size: 100% 100%;

  & > .btn-content {
    transform: translateY(0.1rem);
  }
}

.btn-bg(@name) {
  &:active {
    .pressed(@name);
  }

  & > .btn-fill {
    background: url("../assets/ui/buttons/@{name}1.png"),
      url("../assets/ui/buttons/@{name}3.png");
    background-size: contain, contain;
    background-repeat: no-repeat, no-repeat;
    background-position: left, right;
  }

  background: repeat-x center url("../assets/ui/buttons/@{name}2.png");
  background-size: 100% 100%;
}

@btnFillExtrude: 3px;

.btn-fill {
  height: 100%;
  width: calc(100% + @btnFillExtrude * 2);
  position: absolute;
  left: -@btnFillExtrude;
  top: 0;
}

.btn {
  padding: 1.5rem;
  position: relative;
  min-width: @width;
  font-size: @fontSize;
  font-weight: 700;

  //   .mobile({height: @height / 2; width: @width / 2; font-size: @fontSize / 2});
  //   .big_retina(
  //     {height: @height / 1; width: @width / 1; font-size: @fontSize / 2.2;}
  //   );

  cursor: pointer;
  user-select: none;
  color: #4e3948;
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
  cursor: not-allowed;
}

.red {
  .btn-bg("button_red");

  &.lockPressed {
    .pressed("button_red");
  }
}

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

.btn-content {
  transform: translateY(-0.2rem);
}
</style>

