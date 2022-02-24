<template>
  <UserDialog title="Abandon Game???" @close="close()">
    <template v-slot:footer>
      <div class="flex flex-no-wrap flex-justify-center">
        <CustomButton type="red" @click="close(true)"
          >{{ $t("Exit") }}
        </CustomButton>
        <CustomButton type="green" @click="close()"
          >{{ $t("Resume") }}
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
    },
    async goToShop() {
      this.$close();
      this.$router.push({ name: "march-shop" });
    }
  }
};
</script>

<style lang="less" scoped>
.btn {
  min-width: 60px;
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
