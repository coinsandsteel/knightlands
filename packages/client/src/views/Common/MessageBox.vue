<template>
  <UserDialog :title="title || $t('message')" @close="close" emitClose>
    <template v-slot:content>
      <!-- message -->
      <div class="font-size-20">
        {{ message }}
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton :type="buttonType || 'green'" @click="close"
        >{{ buttonText || $t("close") }}
      </CustomButton>
    </template>
  </UserDialog>
</template>

<script>
export default {
  props: {
    title: String,
    message: String,
    buttonType: String,
    buttonText: String
  },
  methods: {
    async close() {
      this.$close();
    }
  }
};
</script>
