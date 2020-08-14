<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art"></div>

    <div class="flex flex-column width-100 flex-items-end flex-space-evenly margin-bottom-5">
      <MenuIconRow>
        <MenuIcon icon="icon-chests" to="chests" :append="true">
          {{$t("btn-chests")}}
          <template v-slot:marker>
            <FreeChestsMarker></FreeChestsMarker>
          </template>
        </MenuIcon>

        <MenuIcon icon="icon-shop" to="shop" :append="true">{{$t("btn-shop")}}</MenuIcon>
      </MenuIconRow>

      <CustomButton type="green" @click="goTo('army-summon-menu')">Summon Gates</CustomButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import FreeChestsMarker from "@/components/Markers/FreeChestsMarker.vue";
import MenuIcon from "@/components/MenuIcon.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";

export default {
  mixins: [AppSection],
  components: { FreeChestsMarker, MenuIcon, MenuIconRow, CustomButton },
  created() {
    this.title = this.$t("window-title-summon");
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
