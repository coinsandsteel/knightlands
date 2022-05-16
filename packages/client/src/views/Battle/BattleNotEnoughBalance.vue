<template>
  <UserDialog :title="title" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20 padding-left-2 padding-right-2">
        {{ tips }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="goToShop"
        >{{ $t("go-to-shop") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
export default {
  props: ["type"], // gold, tickets
  computed: {
    title() {
      return this.type === "gold"
        ? this.$t("not-enough-gold")
        : this.type === "ticket"
        ? this.$t("not-enough-ticket")
        : this.$t("not-enough-point");
    },
    tips() {
      return this.type === "gold"
        ? this.$t("march-not-enough-gold-tips")
        : this.type === "ticket"
        ? this.$t("april-not-enough-ticket-tips")
        : this.$t("march-not-enough-point-tips");
    }
  },
  methods: {
    async close() {
      this.$close();
    },
    async goToRaids() {
      this.$close();
      this.$router.push({ name: "raids" });
    },
    async goToShop() {
      this.$close();
      this.$router.push({ name: "battle-shop" });
    }
  }
};
</script>
