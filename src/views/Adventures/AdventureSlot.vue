<template>
  <div class="panel width-100 padding-1 margin-bottom-2 adventure-slot flex flex-center">
    <Adventure class="width-100" v-if="isRunning" :adventure="adventure" @claim="$emit('claim')"></Adventure>
    <div v-else>
      <CustomButton type="yellow" @click="$emit('start', adventure)">{{$t("adventure-start")}}</CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Adventure from "./Adventure.vue";

export default {
  props: ["adventure"],
  components: { CustomButton, Adventure },
  computed: {
    isRunning() {
      return this.adventure.startTime > 0;
    }
  }
};
</script>

<style lang="less" scoped>
.adventure-slot {
  min-height: 15rem;
}
</style>