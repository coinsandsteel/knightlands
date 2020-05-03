<template>
  <CustomButton v-bind="$attrs" :skewed="true" btnClass="skewed-btn">
    <div class="flex flex-center flex-start flex-no-wrap">
      <span :class="$attrs.icon" class="huge icon-skewed"></span>
      <span class="white-space-no-wrap">
        <slot></slot>
      </span>
    </div>
  </CustomButton>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  components: { CustomButton }
};
</script>

<style lang="less" scoped>
.skewed-btn {
  padding-left: 0;
}

.icon-skewed {
  padding-right: 1rem;
  transform: translateY(-0.4rem);
}
</style>
