<template>
  <UserDialog :title="title" @click="$close">
    <!-- <template v-slot:content>
      <slider
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
        <slider-item class="flex" v-for="index in enemyList" :key="index">
          <div class="quest-image flex flex-column flex-center flex-end">
            <img ref="enemyView" :src="enemyImage(index)" />
          </div>
        </slider-item>
      </slider>
    </template> -->
    <template v-slot:content>
      <div class="flex flex-column flex-center">
        <div
          class="font-size-20 width-100 margin-bottom-2"
          v-for="t in texts"
          :key="t"
          v-html="$t(t)"
        ></div>
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
  props: ["title", "texts"],
  data: () => ({
    sliderIndex: 0
  })
};
</script>
