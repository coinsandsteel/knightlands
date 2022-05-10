<template>
  <div>
    <Title>Adventure item</Title>
    <div class="flex">
      <div>image</div>
      <div class="flex-full">info</div>
      <div>
        <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="clickHandler"
        >
          {{ $t("start") }}???
        </CustomButton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    clickHandler() {}
  }
};
</script>
<style scoped lang="scss"></style>
