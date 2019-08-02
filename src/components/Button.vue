<template>
  <div
    class="btn"
    :class="[type, {disabled:disabled}, {lockPressed: lockPressed}, {selected: selected}]"
    :style="sizeStyle"
    @click="()=>{$emit('click'); if (cb) cb();}"
  >
    <slot>{{caption}}</slot>
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
  border-image: url("../assets/ui/@{name}_active.png") repeat;
  border-image-slice: 50 100 52 80 fill;
  border-image-width: 32px;
  border-style: solid;
  border-width: 1px;
}

.selected(@name) {
  border-image: url("../assets/ui/@{name}_selected.png") repeat;
  border-image-slice: 50 100 52 80 fill;
  border-image-width: 32px;
  border-style: solid;
  border-width: 1px;
}

.btn-bg(@name) {
  border-image: url("../assets/ui/@{name}.png") repeat;
  /* top | right | bottom | left */
  border-image-slice: 50 100 52 80 fill;
  border-image-width: 32px;
  border-style: solid;
  border-width: 1px;

  &:active {
    .pressed(@name);
  }
}

.btn {
  padding: 1.5rem;
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

.small {
  //   .mobile({height: @height / 2; width: @width / 2;});
}

.big {
  //   .mobile({font-size: 2rem;});
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
</style>

