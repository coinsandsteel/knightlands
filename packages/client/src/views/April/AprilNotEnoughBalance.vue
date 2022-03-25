<template>
  <UserDialog :title="title" @close="close">
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{ tips }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton
        :type="type === 'gold' ? 'yellow' : 'red'"
        @click="clickHandler"
        >{{ type === "gold" ? $t("go-to-shop") : $t("close") }}
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
    clickHandler() {
      if (this.type === "gold") {
        this.goToShop();
        return;
      }
      // this.goToRaids();
      this.close();
    },
    async goToRaids() {
      this.$close();
      this.$router.push({ name: "raids" });
    },
    async goToShop() {
      this.$close();
      this.$router.push({ name: "april-shop" });
    }
  }
};
</script>
