<template>
  <UserDialog @close="handleClose()" emitClose title="confirm">
    <template v-slot:content>
      <div class="text-align-center font-size-22">
        cost of leveling up: 200
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="handleClose()">Cancel</CustomButton>
      <CustomButton type="yellow" @click="confirmHandler">Ok</CustomButton>
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
