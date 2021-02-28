<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art screen-background"></div>

    <div
      class="flex flex-column width-100 flex-items-end flex-space-evenly margin-bottom-5"
    >
      <MenuIconRow>
        <MenuIcon
          icon="skewed_icon_garisson"
          :to="{ name: 'garrison' }"
          section="garrison"
          >{{ $t("garrison") }}</MenuIcon
        >
      </MenuIconRow>

      <MenuIconRow>
        <MenuIcon
          icon="skewed_icon_army_edit_units"
          :to="{ name: 'edit-unit' }"
          :append="true"
          section="units"
          >{{ $t("units") }}</MenuIcon
        >

        <MenuIcon
          icon="skewed_icon_summon"
          :to="{ name: 'alchemy-lab' }"
          section="alchemyLab"
          id="lab"
          >{{ $t("alch-lab") }}</MenuIcon
        >
      </MenuIconRow>

      <MenuIconRow>
        <MenuIcon
          icon="skewed_icon_army_composition"
          :to="{ name: 'army-composition' }"
          :append="true"
          section="legions"
          id="legions"
          >{{ $t("legions") }}</MenuIcon
        >

        <MenuIcon
          icon="skewed_icon_beast"
          :to="{ name: 'beast' }"
          section="beast"
          id="beast"
          >{{ $t("beast") }}
          <template v-slot:marker>
            <BeastMarker />
          </template>
        </MenuIcon>
      </MenuIconRow>
    </div>
  </div>
</template>

<script>
import MenuIcon from "@/components/MenuIcon.vue";
import AppSection from "@/AppSection.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";
import BeastMarker from "@/components/Markers/Castle/BeastMarker.vue";

export default {
  name: "castle",
  mixins: [AppSection],
  components: {
    MenuIcon,
    MenuIconRow,
    BeastMarker
  },
  created() {
    this.title = this.$t("window-title-castle");
  }
};
</script>

<style lang="less" scoped>
.home-art {
  background-image: url("../../assets/backgrounds/gates_bg.jpg");
  background-size: cover;
  background-position: bottom center;
}
</style>
