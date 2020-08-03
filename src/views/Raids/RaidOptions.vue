<template>
  <div class="flex flex-column flex-center">
      <CustomButton type="grey" @click="$emit('log')">
      <span class="icon-log"></span>
    </CustomButton>
    <CustomButton type="grey" @click="$emit('rewards')">
      <span class="icon-loot"></span>
    </CustomButton>
    <CustomButton type="grey" @click="$emit('info')">
      <span class="icon-info dark"></span>
    </CustomButton>
    <CustomButton type="grey" @click="$emit('legion')">
      <span class="icon-legion"></span>
    </CustomButton>
    <CustomButton type="grey" @click="$emit('chart')">
      <span class="icon-chart"></span>
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  components: { CustomButton }
};
</script>
