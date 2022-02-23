<template>
  <UserDialog
    :title="type === 'gold' ? 'Not enough gold???' : 'Not enough tickets???'"
    @close="close"
  >
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{
          type === "gold"
            ? $t("You can buy gold in the shop???")
            : $t("You can earn tickets by joining Raids???")
        }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="clickHandler"
        >{{ type === "gold" ? $t("Go to shop") : $t("Go to Raids") }}
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
    clickHandler() {
      if (this.type === "gold") {
        this.goToShop();
        return;
      }
      this.goToRaids();
    },
    async goToRaids() {
      this.$close();
      this.$router.push({ name: "raids" });
    },
    async goToShop() {
      this.$close();
      this.$router.push({ name: "march-shop" });
    }
  }
};
</script>

<style lang="less" scoped></style>
