<template>
  <div class="screen-content flex-end">
    <div class="art screen-background"></div>

    <div class="flex flex-column width-100 flex-items-center flex-space-evenly shift-buttons">
      <CustomButton type="grey" :big="true" width="30rem" class="margin-bottom-1">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'army-composition' }">
          <span class="icon-tower huge"></span>
          <span class="flex-1">Composition</span>
        </router-link>
      </CustomButton>
      <CustomButton type="red" :big="true" width="30rem" class="margin-bottom-1 shift-left-1">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'crafting' }">
          <span class="icon-tower huge"></span>
          <span class="flex-1">Banishment</span>
        </router-link>
      </CustomButton>
      <CustomButton type="yellow" width="30rem" class="margin-bottom-1 shift-left-2" :big="true">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'crafting' }">
          <span class="icon-craft huge"></span>
          <span class="flex-1">Level Up</span>
        </router-link>
      </CustomButton>
      <CustomButton type="yellow" width="30rem" class="margin-bottom-1 shift-left-2" :big="true">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'crafting' }">
          <span class="icon-craft huge"></span>
          <span class="flex-1">Ability Transfer</span>
        </router-link>
      </CustomButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";

export default {
  mixins: [AppSection],
  components: {
    CustomButton
  },
  created() {
    this.title = this.$t("window-title-army");
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.art {
  background-image: url("../../assets/backgrounds/castle_blur.png");
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

