<template>
  <div class="screen-content flex-end">
    <div class="art screen-background"></div>

    <div class="flex flex-column width-100 flex-items-center flex-space-evenly shift-buttons">
      <CustomButton type="grey" :big="true" width="30rem" class="margin-bottom-1">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'army-composition' }">
          <span class="icon-legion huge"></span>
          <span class="flex-1">Legions</span>
        </router-link>
      </CustomButton>
      <CustomButton type="red" :big="true" width="30rem" class="margin-bottom-1 shift-left-1">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'crafting' }">
          <span class="icon-banishment huge"></span>
          <span class="flex-1">Banishment</span>
        </router-link>
      </CustomButton>
      <CustomButton type="yellow" width="30rem" class="margin-bottom-1 shift-left-2" :big="true">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'edit-unit' }">
          <span class="icon-units huge"></span>
          <span class="flex-1">Units</span>
        </router-link>
      </CustomButton>
      <CustomButton type="yellow" width="30rem" class="margin-bottom-1 shift-left-2" :big="true">
        <router-link tag="div" class="flex width-100 flex-justify-start flex-items-center" :to="{ name: 'crafting' }">
          <span class="icon-ability-transfer huge"></span>
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

.shift-buttons {
  padding-bottom: 20%;
}
</style>

