<template>
  <div class="screen-content">
    <!-- <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <MarchMainMenu />
      </div>
    </div> -->
    <MarchMainMenu />
  </div>
</template>
<script>
import MarchMainMenu from "@/views/March/MarchMainMenu.vue";
export default {
  components: { MarchMainMenu },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less"></style>
