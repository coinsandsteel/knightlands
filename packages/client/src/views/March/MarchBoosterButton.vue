<template>
  <div class="march-booster-button flex flex-column flex-nowrap">
    <div class="font-size-25">Price???: {{ price }}</div>
    <div class="flex flex-full flex-center font-size-25">
      {{ name }}
    </div>
    <div class="flex flex-row flex-nowrap flex-space-between">
      <div
        class="booster-hint flex flex-center font-size-30"
        @click="buyHandler"
      >
        ?
      </div>
      <CheckedIcon v-if="hasBought" class="checked-icon" />
      <div
        v-else
        class="booster-buy flex flex-center font-size-30"
        @click="buyHandler"
      >
        +
      </div>
    </div>
  </div>
</template>
<script>
import CheckedIcon from "@/views/Lunar/Checked.vue";

export default {
  components: { CheckedIcon },
  props: {
    name: String,
    price: Number,
    hasBought: Boolean
  },
  data() {
    return {};
  },
  methods: {
    hintHandler() {},
    buyHandler() {}
  }
};
</script>
<style scoped lang="less">
.march-booster-button {
  width: 120px;
  height: 120px;
  background: #666;
}
.booster-hint,
.booster-buy {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  color: #222;
}
.checked-icon {
  color: #80fa67;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  margin-top: 5px;
}
</style>
