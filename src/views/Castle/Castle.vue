<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art screen-background"></div>

    <div class="flex flex-column width-100 flex-items-center flex-space-evenly shift-buttons">
      <CustomButton type="grey" :big="true" width="30rem" class="margin-bottom-1" :disabled="true">
        <div class="flex width-100 flex-justify-start flex-items-center">
          <span class="icon-tower huge"></span>
          <span class="flex-1">Castle Grounds</span>
        </div>
      </CustomButton>
      <CustomButton type="red" :big="true" width="30rem" class="margin-bottom-1 shift-left-1">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'army' }">
          <span class="icon-tower huge"></span>
          <span class="flex-1">{{$t('menu-army')}}</span>
        </router-link>
      </CustomButton>
      <CustomButton type="yellow" width="30rem" class="margin-bottom-1 shift-left-2" :big="true">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'crafting' }">
          <span class="icon-craft huge"></span>
          <span class="flex-1">{{$t('menu-blacksmith')}}</span>
        </router-link>
      </CustomButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";

export default {
  name: "castle",
  mixins: [AppSection],
  components: {
    CustomButton
  },
  created() {
    this.title = this.$t("window-title-castle");
  }
};
</script>

<style lang="less" scoped>
.home-art {
  background-image: url("../../assets/backgrounds/castle_pixel6.png");
}

// .shift-left-1 {
//     transform: translateX(-2.5rem);
// }

// .shift-left-2 {
//     transform: translateX(-5rem);
// }

.shift-buttons {
    padding-bottom: 20%;
}
</style>

