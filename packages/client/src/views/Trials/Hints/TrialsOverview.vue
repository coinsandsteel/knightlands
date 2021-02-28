<template>
  <UserDialog title="tr-over" @click="$close">
    <template v-slot:content>
      <!-- <slider
        ref="slider"
        animation="fade"
        :touch="true"
        :control-btn="false"
        :indicators="true"
        :autoplay="false"
        width="100%"
        height="100%"
        v-model="sliderIndex"
      >
        <slider-item class="flex flex-column font-size-20">
          <span>{{ "Each trial is a source of enchanting materials." }}</span>
        </slider-item>
        <slider-item class="flex flex-column font-size-20">
            <Title>{{"Trials of Honor"}}</Title>
          <span>{{ "Each trial is a source of enchanting materials." }}</span>
        </slider-item>
      </slider> -->
      <div class="flex flex-column font-size-22">
        <span class="margin-bottom-1">{{ $t("tr-over-1") }}</span>
        <div class="margin-bottom-1" v-html="$t('tr-over-2')"></div>
        <div class="margin-bottom-1" v-html="$t('tr-over-3')"></div>
        <div class="margin-bottom-1" v-html="$t('tr-over-4')"></div>
        <div class="margin-bottom-1" v-html="$t('tr-over-7')"></div>
        <div class="margin-bottom-1" v-html="$t('tr-over-5')"></div>
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
import Title from "@/components/Title.vue";

export default {
  components: { UserDialog, CustomButton, Title },
  data: () => ({
    sliderIndex: 0
  })
};
</script>
