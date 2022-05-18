<template>
  <UserDialog @close="$close" title="squad bonus">
    <template v-slot:content>
      <div class="font-size-22">
        information.....
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
