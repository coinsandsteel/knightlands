<template>
  <UserDialog @close="handleClose" emitClose title="Select difficulty">
    <template v-slot:content>
      <div class="text-align-center">
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          @click="handleClose"
          >{{ $t("normal???") }}</CustomButton
        >
      </div>
      <div class="text-align-center">
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          @click="handleClose"
          >{{ $t("hard???") }}</CustomButton
        >
      </div>
    </template>
    <!-- <template v-slot:footer>
      <CustomButton type="yellow" @click="handleClose">{{
        $t("normal???")
      }}</CustomButton>
    </template> -->
  </UserDialog>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleClose(result) {
      this.$close(result);
      if (!result) {
        return;
      }
      this.$router.push({
        name: "battle-adventure-squad",
        params: { id: 123 }
      });
    }
  }
};
</script>
<style scoped lang="less"></style>
