<template>
  <div>
    <div class="flex flex-items-end flex-space-between relative height-100 shift-buttons">
      <div class="home-art absolute-stretch"></div>
      <!-- <AnimatedBackground></AnimatedBackground> -->

      <div class="flex flex-column flex-items-center flex-space-evenly margin-left-2">
        <MenuIcon icon="icon-units" :to="{name: 'edit-unit'}" :append="true">Units</MenuIcon>

        <MenuIcon icon="icon-legion" :to="{name: 'army-composition'}" :append="true">Legions</MenuIcon>
      </div>

      <div class="flex flex-column flex-items-center flex-space-evenly margin-right-2">
        <MenuIcon icon="icon-banishment" :to="{name: 'banishment'}" :append="true">Banishment</MenuIcon>

        <MenuIcon
          icon="icon-ability-transfer"
          :to="{name: 'ability-transfer'}"
          :append="true"
        >Ability Transfer</MenuIcon>
      </div>
    </div>
  </div>
</template>

<script>
import MenuIcon from "@/components/MenuIcon.vue";
import AppSection from "@/AppSection.vue";

export default {
  name: "castle",
  mixins: [AppSection],
  components: {
    MenuIcon
  },
  created() {
    this.title = this.$t("window-title-castle");
  }
};
</script>

<style lang="less" scoped>
.home-art {
  background-image: url("../../assets/backgrounds/castle_bg.jpg");
  background-size: cover;
  background-position: bottom center;
}

.shift-buttons {
  padding-bottom: 20%;
}
</style>

