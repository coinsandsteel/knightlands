<template>
  <div>
    <div class="march-booster-button relative">
      <svg viewBox="0 0 300 330" class="width-100" />
      <div class="absolute-stretch flex flex-center" @click="buyHandler">
        <!-- <div class="font-size-25">Price???: {{ price }}</div>
        <div class="flex flex-full flex-center font-size-25">
          {{ name }}
        </div> -->
        <div
          class="march-booster-image"
          :class="`march-booster-image--${type}`"
        ></div>
        <!-- <div
          v-else
          class="booster-buy flex flex-center font-size-30 pointer"
          @click="buyHandler"
        >
          +
        </div> -->
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
  data() {
    return {};
  },
  methods: {
    hintHandler() {
      this.$emit("hint");
    },
    buyHandler() {
      if (this.hasBought) {
        return;
      }
      this.$emit("buy");
    }
  }
};
</script>
<style scoped lang="less">
.march-booster-button {
  // max-width: 120px;
  // height: 120px;
  // padding-bottom: 110%;
  background-image: url("/images/march/booster_container.png");
  background-size: 100%;
  background-repeat: no-repeat;
}
// .booster-hint,
// .booster-buy {
//   width: 30px;
//   height: 30px;
//   background: rgba(255, 255, 255, 0.7);
//   border-radius: 0.5rem;
//   color: #222;
// }
.booster-hint {
  width: 4rem;
  height: 4rem;
  color: #fff;
  background-image: url("/images/march/blue_marker.png");
  background-size: 100%;
  background-repeat: no-repeat;
  transform: translate(-40%, -40%);
}
.checked-icon {
  color: #80fa67;
  width: 20px;
  height: 20px;
  // margin-right: 5px;
  // margin-top: 5px;
  transform: translate(-5px, -7px);
}
.march-booster-image {
  background-size: 100%;
  background-repeat: no-repeat;
  width: 50%;
  // height: 46%;
  height: 0;
  padding-bottom: 50%;
}
.march-booster-image--max-hp {
  background-image: url("/images/march/max_hp.png");
}
.march-booster-image--extra-life {
  background-image: url("/images/march/extra_life.png");
}
.march-booster-image--key {
  background-image: url("/images/march/key.png");
}
</style>
