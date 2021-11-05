<template>
  <div class="mask relative flex flex-center" @click="$close">
    <div
      class="flex flex-column flex-item-center flex-no-wrap flex-column panel-popup width-100 padding-3"
    >
      <img src="/images/ui/maintenance.png" class="margin-bottom-3" alt="" />
      <span class="shutdown-title margin-bottom-2 font-weight-700">{{
        $t("prompt-shutdown-h")
      }}</span>
      <span class="font-size-22 margin-bottom-3 font-weight-700">{{
        $t("prompt-shutdown-t")
      }}</span>
      <CustomButton class="center" width="30%" type="grey" @click="$close">{{
        $t("btn-ok")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    CustomButton
  }
};
</script>

<style lang="less" scoped>
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.555);
  z-index: 200;
}
img {
  max-height: 15vh;
  margin-top: 3vh;
}
.shutdown-title {
  color: #7ce7de;
  font-size: 3.5rem;
}
</style>
