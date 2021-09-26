<template>
  <div class="width-100 adventure-slot flex flex-column">
    <Title v-if="!isRunning" :stackTop="true" :stackBottom="true">{{
      $t("new-adv")
    }}</Title>
    <div class="color-panel-5 full-flex flex flex-column">
      <Adventure
        class="width-100"
        v-if="isRunning"
        :adventure="adventure"
        @claim="$emit('claim')"
      ></Adventure>
      <div class="flex flex-center full-flex width-100" v-else>
        <CustomButton
          type="yellow"
          @click="$emit('start', adventure)"
          minWidth="20rem"
          >{{ $t("adventure-start") }}</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Adventure from "./Adventure.vue";
import Title from "@/components/Title.vue";

export default {
  props: ["adventure"],
  components: { CustomButton, Adventure, Title },
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
