<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art"></div>
    <div class="flex flex-column width-100 flex-items-end flex-space-evenly margin-bottom-5">
      <MenuIconRow>
        <MenuIcon icon="icon-recipe-book" to="recipes" :append="true">
          <span>{{$t("btn-recipes")}}</span>
        </MenuIcon>

        <MenuIcon icon="icon-craft" to="craft" :append="true">
          <span>{{$t("btn-crafting")}}</span>
        </MenuIcon>

        <MenuIcon icon="icon-disenchant" to="disenchant" :append="true">
          <span>{{$t("btn-disenchant")}}</span>
        </MenuIcon>
      </MenuIconRow>

      <MenuIconRow>
        <MenuIcon icon="icon-craft-level" to="level" :append="true">
          <span>{{$t("btn-crafting-level")}}</span>
        </MenuIcon>

        <MenuIcon icon="icon-craft-upgrade" to="upgrade" :append="true">
          <span>{{$t("btn-crafting-upgrade")}}</span>
        </MenuIcon>

        <MenuIcon icon="icon-enchant" to="enchant" :append="true">
          <span>{{$t("btn-enchant")}}</span>
        </MenuIcon>
      </MenuIconRow>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import SkewedButton from "@/components/SkewedButton.vue";
import MenuIcon from "@/components/MenuIcon.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";

export default {
  mixins: [AppSection],
  components: { SkewedButton, MenuIcon, MenuIconRow },
  created() {
    this.title = this.$t("window-title-crafting");
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    }
  }
};
</script>

<style lang="less" scoped>
.home-art {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-image: url("../../assets/ui/background_craft.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 50vh;
  z-index: 0;
}
</style>
