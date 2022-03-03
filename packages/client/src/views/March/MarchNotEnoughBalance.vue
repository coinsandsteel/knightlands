<template>
  <UserDialog
    :title="type === 'gold' ? $t('not-enough-gold') : $t('not-enough-ticket')"
    @close="close"
  >
    <template v-slot:content>
      <!-- tips -->
      <div class="font-size-20">
        {{
          type === "gold"
            ? $t("not-enough-ticket")
            : $t("march-not-enough-ticket-tips")
        }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="clickHandler"
        >{{ type === "gold" ? $t("go-to-shop") : $t("go-to-raids") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
export default {
  props: ["type"], // gold, tickets
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
