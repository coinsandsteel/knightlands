<template>
  <div class="flex full-flex flex-center">
    <span class="font-size-20" v-html="$t('no-acc')"></span>
    <CustomButton type="yellow" @click="goToRaids">{{
      $t("v-raids")
    }}</CustomButton>
    <span class="font-size-20" v-html="$t('no-acc2')"></span>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
export default {
  components: { CustomButton },
  methods: {
    goToRaids() {
      this.$router.push({ name: "raids" });
    }
  }
};
</script>
