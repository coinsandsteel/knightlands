<template>
  <UserDialog title="abandon-game?" @close="close()">
    <template v-slot:footer>
      <div class="flex flex-column flex-no-wrap flex-justify-center">
        <CustomButton type="green" @click="close()"
          >{{ $t("RESUME") }}
        </CustomButton>
        <CustomButton
          type="red"
          @click="close(true)"
          class="margin-bottom-4 margin-top-4"
          >{{ $t("EXIT") }}
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
export default {
  methods: {
    async close(result = false) {
      this.$close(result);
    }
  }
};
</script>

<style lang="less" scoped>
.btn {
  min-width: 100px;
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
