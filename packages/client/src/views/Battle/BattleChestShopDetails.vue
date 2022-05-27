<template>
  <UserDialog @close="handleClose()" emitClose title="Details">
    <template v-slot:content>
      <div class="text-align-center font-size-22">
        • Every day, completing daily tasks, you can take daily chests for free.
      </div>
      <div class="text-align-center font-size-22">
        • You can buy Coin chests for the in-game currency. Donate chest buy for
        donate
      </div>
      <div class="text-align-center font-size-22">
        • Some Tier III characters are only available in Donate chests
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="handleClose()">{{
        $t("close???")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    confirmHandler() {
      this.handleClose(true);
    },
    handleClose(result) {
      this.$close(result);
      if (!result) {
        return;
      }
    }
  }
};
</script>
<style scoped lang="less"></style>
