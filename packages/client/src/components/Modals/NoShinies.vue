<template>
  <UserDialog title="no-shinies" @close="$close">
    <template v-slot:content>
      <div
        class="flex flex-center font-size-22 whitespace-prewrap"
        v-html="$t('no-shinies-m')"
      ></div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="refill"
        >{{ $t("buy-shinies") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: { UserDialog, CustomButton },
  methods: {
    refill() {
      this.$router.push({ name: "top-up" });
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped></style>
