<template>
  <div
    class="battle-ability-select flex flex-center pointer"
    @click="close(123)"
  >
    <div class="font-size-22 relative">
      <!-- center -->
      <div class="center-ability"></div>
      <div class="top-ability absolute">
        <div class="ability-border absolute"></div>
      </div>
      <div class="left-ability absolute">
        <div class="ability-border absolute"></div>
      </div>
      <div class="right-ability absolute">
        <div class="ability-border absolute"></div>
      </div>
      <div class="bottom-ability absolute">
        <div class="ability-border absolute"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    close(result) {
      this.$emit("close", result);
    }
  }
};
</script>
<style scoped lang="scss">
$width: 60px;
.battle-ability-select {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.557);
}
.center-ability {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.top-ability {
  top: -14px;
  left: 50%;
  transform: translate(-50%, -100%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.left-ability {
  top: 50%;
  left: -14px;
  transform: translate(-100%, -50%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.right-ability {
  top: 50%;
  right: -14px;
  transform: translate(100%, -50%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.bottom-ability {
  bottom: -14px;
  left: 50%;
  transform: translate(-50%, 100%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.ability-border {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid #fff;
  transform: rotate(45deg);
}
</style>
