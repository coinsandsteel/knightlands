<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="screen-background"></div>

    <div class="flex flex-column width-100 flex-items-center flex-space-evenly shift-buttons">
      <MenuIcon icon="icon-units" :to="{name: 'edit-unit'}" :append="true">Units</MenuIcon>

      <MenuIcon icon="icon-legion" :to="{name: 'army-composition'}" :append="true">Legions</MenuIcon>

      <MenuIcon icon="icon-banishment" :to="{name: 'banishment'}" :append="true">Banishment</MenuIcon>

      <MenuIcon
        icon="icon-ability-transfer"
        :to="{name: 'ability-transfer'}"
        :append="true"
      >Ability Transfer</MenuIcon>
    </div>
  </div>
</template>

<script>
import MenuIcon from "@/components/MenuIcon.vue";
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";

export default {
  name: "castle",
  mixins: [AppSection],
  components: {
    CustomButton,
    MenuIcon
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

