<template>
  <div class="flex flex-column flex-center">
    <CustomButton type="grey" v-if="left" @click="$emit('info')">
      <span class="icon-info dark"></span>
    </CustomButton>
    <CustomButton type="grey" v-if="left" @click="$emit('log')">
      <span class="icon-log"></span>
    </CustomButton>
    <CustomButton type="grey" v-if="left" @click="$emit('chart')">
      <span class="icon-chart"></span>
    </CustomButton>


    <CustomButton type="grey" v-if="!left" @click="$emit('rewards')">
      <span class="icon-loot"></span>
    </CustomButton>
    <CustomButton type="grey" v-if="!left" @click="$emit('challenges')">
      <span class="icon-challenge"></span>
    </CustomButton>
    <CustomButton type="grey" v-if="!left" @click="$emit('legion')">
      <span class="icon-legion"></span>
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  props: ["left"],
  components: { CustomButton }
};
</script>
