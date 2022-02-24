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
