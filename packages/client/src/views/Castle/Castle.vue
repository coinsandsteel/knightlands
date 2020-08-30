<template>
  <div>
    <div
      class="flex flex-items-end flex-space-between relative height-100 shift-buttons"
    >
      <div class="home-art absolute-stretch"></div>

      <MenuIconRow>
        <MenuIcon icon="icon-recipe-book" :to="{ name: 'recipe-book' }">
          <span>{{ $t("btn-recipes") }}</span>
        </MenuIcon>

        <MenuIcon icon="icon-craft" :to="{ name: 'crafting' }">
          <span>{{ $t("btn-crafting") }}</span>
        </MenuIcon>

        <MenuIcon icon="icon-disenchant" :to="{ name: 'crafting-disenchant' }">
          <span>{{ $t("btn-disenchant") }}</span>
        </MenuIcon>
      </MenuIconRow>

      <MenuIconRow>
        <MenuIcon icon="icon-craft-level" :to="{ name: 'crafting-upgrade' }">
          <span>{{ $t("btn-crafting-level") }}</span>
        </MenuIcon>

        <MenuIcon icon="icon-craft-upgrade" :to="{ name: 'crafting-unbind' }">
          <span>{{ $t("btn-crafting-upgrade") }}</span>
        </MenuIcon>

        <MenuIcon icon="icon-enchant" :to="{ name: 'crafting-enchant' }">
          <span>{{ $t("btn-enchant") }}</span>
        </MenuIcon>
      </MenuIconRow>

      <div
        class="flex flex-column flex-items-center flex-space-evenly margin-left-2"
      >
        <MenuIcon icon="icon-units" :to="{ name: 'edit-unit' }" :append="true"
          >Units</MenuIcon
        >

        <MenuIcon
          icon="icon-legion"
          :to="{ name: 'army-composition' }"
          :append="true"
          >Legions</MenuIcon
        >
      </div>

      <div
        class="flex flex-column flex-items-center flex-space-evenly margin-right-2"
      >
        <MenuIcon icon="icon-garrison" :to="{ name: 'garrison' }"
          >Garrison</MenuIcon
        >
        <MenuIcon icon="icon-beast" :to="{ name: 'beast' }">Beast</MenuIcon>
        <!-- 
        <MenuIcon
          icon="icon-ability-transfer"
          :to="{name: 'ability-transfer'}"
          :append="true"
        >Ability Transfer</MenuIcon> -->
      </div>
    </div>
  </div>
</template>

<script>
import MenuIcon from "@/components/MenuIcon.vue";
import AppSection from "@/AppSection.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";

export default {
  name: "castle",
  mixins: [AppSection],
  components: {
    MenuIcon,
    MenuIconRow
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
