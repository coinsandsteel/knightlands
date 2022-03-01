<template>
  <div>
    <div class="march-booster-button relative">
      <svg viewBox="0 0 300 300" class="width-100" />
      <div class="march-booster-button-background absolute"></div>
      <div class="absolute-stretch flex flex-center" @click="buyHandler">
        <div
          class="march-booster-image"
          :class="`march-booster-image--${type}`"
        ></div>
      </div>
      <div
        class="booster-hint absolute-top-left flex flex-center font-size-30 pointer"
        @click="hintHandler"
      >
        !
      </div>
      <CheckedIcon
        v-if="hasBought"
        class="checked-icon absolute-bottom-right"
      />
    </div>
    <div class="margin-top-2 relative">
      <MarchGold :value="price" class="absolute-center flex flex-no-wrap" />
    </div>
  </div>
</template>
<script>
import CheckedIcon from "@/views/Lunar/Checked.vue";
import MarchGold from "@/views/March/MarchGold.vue";

export default {
  components: { CheckedIcon, MarchGold },
  props: {
    name: String,
    price: Number,
    hasBought: Boolean,
    type: String
  },
  methods: {
    hintHandler() {
      this.$emit("hint");
    },
    buyHandler() {
      this.$emit("buy");
    }
  }
};
</script>
<style scoped lang="less">
.march-booster-button {
  // background-image: url("/images/march/booster_container.png");
  // background-size: 100%;
  // background-repeat: no-repeat;

  border: 1px solid transparent;
  border-image-source: url("/images/march/pet_bg.png");
  border-image-width: 14px;
  border-image-slice: 30;
  border-image-outset: 0;
  border-image-repeat: round;
}
.booster-hint {
  width: 4rem;
  height: 4rem;
  color: #0f2b44;
  background-image: url("/images/march/green_marker.png");
  background-size: 100%;
  background-repeat: no-repeat;
  transform: translate(-40%, -40%);
}
.checked-icon {
  color: #80fa67;
  width: 20px;
  height: 20px;
  transform: translate(-5px, -7px);
}
.march-booster-image {
  background-size: 100%;
  background-repeat: no-repeat;
  width: 50%;
  height: 0;
  padding-bottom: 50%;
}
.march-booster-image--max-hp {
  background-image: url("/images/march/cards/hp.png");
}
.march-booster-image--extra-life {
  background-image: url("/images/march/cards/extra_life.png");
}
.march-booster-image--key {
  background-image: url("/images/march/cards/key.png");
}
.march-booster-button-background {
  background-size: 100%;
  background-repeat: no-repeat;
  background-color: #00a3ee;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  top: 5px;
  left: 5px;
}
</style>
