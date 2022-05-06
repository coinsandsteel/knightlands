<template>
  <UserDialog @close="$close" title="promo-units">
    <template v-slot:content>
      <div class="font-size-22">
        You will receive the average amount of gold spent on upgrading weaker
        units.<br />
        A stronger unit will receive an average amount of experience from weaker
        units.
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="yellow" @click="handleClose">{{
        $t("close")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
export default {
  props: ["usedUnits"],
  data: () => ({}),
  methods: {
    handleClose() {
      this.$close();
    }
  }
};
</script>
