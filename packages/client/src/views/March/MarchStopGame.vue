<template>
  <UserDialog title="Abandon Game???" @close="close()">
    <template v-slot:footer>
      <div class="flex flex-no-wrap flex-justify-center">
        <CustomButton type="green" @click="close()"
          >{{ $t("Resume") }}
        </CustomButton>
        <CustomButton type="red" @click="close(true)"
          >{{ $t("Exit") }}
        </CustomButton>
      </div>
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
  // props: ["type"], // gold, tickets
  // computed: {
  //   ...mapState({
  //     // dailyRewards: state => state.march.dailyRewards
  //   })
  // },
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
