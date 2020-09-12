<template>
  <div class="relative">
    <Loot :item="item" @hint="$emit('select')" :locked="!filled" />
    <!-- <div v-if="!filled" class="overlay-color absolute-stretch"></div> -->
    <div v-if="!filled" class="plus-btn pointer-events-none"></div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";

export default {
  props: ["item", "filled"],
  components: { Loot }
};
</script>

<style lang="less" scoped>
.plus-btn {
  background-image: url("./../../../../assets/ui/button_plus_training_camp.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 0;
  transform: translateY(50%) translateX(50%);
}
</style>
