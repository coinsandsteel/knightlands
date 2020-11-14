<template>
  <div class="screen-content flex-end padding-bottom-5">
    <div class="art screen-background"></div>

    <MenuIconRow>
      <MenuIcon icon="skewed_icon_craft" to="elemental" :append="true">
        <span>{{ $t("btn-new-weapon") }}</span>
      </MenuIcon>

      <MenuIcon icon="skewed_icon_unbind" to="evolve" :append="true">
        <span>{{ $t("btn-evolve") }}</span>
      </MenuIcon>
    </MenuIconRow>

    <MenuIconRow>
      <MenuIcon icon="skewed_icon_recipes" to="craft" :append="true">
        <span>{{ $t("btn-recipes") }}</span>
      </MenuIcon>

      <MenuIcon icon="skewed_icon_disenchant" to="disenchant" :append="true">
        <span>{{ $t("btn-disenchant") }}</span>
      </MenuIcon>
    </MenuIconRow>

    <MenuIconRow>
      <MenuIcon icon="skewed_icon_lvlup" to="level" :append="true">
        <span>{{ $t("btn-crafting-level") }}</span>
      </MenuIcon>

      <MenuIcon icon="skewed_icon_upgrade" to="upgrade" :append="true">
        <span>{{ $t("btn-crafting-upgrade") }}</span>
      </MenuIcon>

      <MenuIcon icon="skewed_icon_enchant" to="enchant" :append="true">
        <span>{{ $t("btn-enchant") }}</span>
      </MenuIcon>
    </MenuIconRow>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import MenuIcon from "@/components/MenuIcon.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";

export default {
  mixins: [AppSection],
  components: { MenuIcon, MenuIconRow },
  created() {
    this.title = this.$t("window-title-crafting");
    this.$options.useRouterBack = true;
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    }
  }
};
</script>

<style lang="less" scoped>
.art {
  background-image: url("../../assets/backgrounds/alchemy_lab.jpg");
  background-size: cover;
  background-position: bottom center;
}
</style>
