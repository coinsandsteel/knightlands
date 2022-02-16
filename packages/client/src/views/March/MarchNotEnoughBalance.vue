<template>
  <UserDialog title="Not enough balance???" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">{{ $t("Not enough balance???") }}</div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="goToShop"
        >{{ $t("purchase") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
// import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
// import { mapState } from "vuex";
// import UserDialog from "@/components/UserDialog.vue";

export default {
  // components: {
  //   UserDialog
  // },
  // mixins: [NetworkRequestErrorMixin],
  // data() {
  //   return {};
  // },
  props: ["type"], // gold, tickets
  // computed: {
  //   ...mapState({
  //     // dailyRewards: state => state.march.dailyRewards
  //   })
  // },
  methods: {
    async close() {
      this.$close();
    },
    async goToShop() {
      this.$close();
      this.$router.push({ name: "march-shop" });
    }
  }
};
</script>

<style lang="less" scoped></style>
