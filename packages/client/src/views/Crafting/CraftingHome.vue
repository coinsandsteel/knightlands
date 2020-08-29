<template>
  <div class="screen-content flex-end padding-bottom-5">
    <div class="screen-background"></div>

    <MenuIconRow>
      <MenuIcon icon="icon-recipe-book" to="recipes" :append="true">
        <span>{{ $t("btn-recipes") }}</span>
      </MenuIcon>

      <MenuIcon icon="icon-craft" to="craft" :append="true">
        <span>{{ $t("btn-crafting") }}</span>
      </MenuIcon>

      <MenuIcon icon="icon-disenchant" to="disenchant" :append="true">
        <span>{{ $t("btn-disenchant") }}</span>
      </MenuIcon>
    </MenuIconRow>

    <MenuIconRow>
      <MenuIcon icon="icon-craft-level" to="level" :append="true">
        <span>{{ $t("btn-crafting-level") }}</span>
      </MenuIcon>

      <MenuIcon icon="icon-craft-upgrade" to="upgrade" :append="true">
        <span>{{ $t("btn-crafting-upgrade") }}</span>
      </MenuIcon>

      <MenuIcon icon="icon-enchant" to="enchant" :append="true">
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
