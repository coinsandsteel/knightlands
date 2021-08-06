<template>
  <UserDialog title="tr-over" @click="$close">
    <template v-slot:content>
      <div class="flex flex-column font-size-22">
        <span class="margin-bottom-1">{{ $t("tr-over-1") }}</span>
        <div class="margin-bottom-1" v-html="$t('tr-over-4')"></div>
        <div class="margin-bottom-1" v-html="$t('tr-over-6')"></div>
      </div>
    </template>
    <template v-slot:footer>
      <CustomButton type="grey" @click="$close">{{
        $t("btn-ok")
      }}</CustomButton>
    </template>
  </UserDialog>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: { UserDialog, CustomButton },
  data: () => ({
    sliderIndex: 0
  })
};
</script>
