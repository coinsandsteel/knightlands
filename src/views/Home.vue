<template>
  <div class="flex flex-column flex-end flex-items-center relative">
    <div class="home-art"></div>

    <div class="flex flex-column width-100 flex-items-end flex-space-evenly margin-bottom-5">
      <MenuIconRow>
        <MenuIcon icon="icon-quests" to="quest" :append="true">
          {{$t("btn-quests")}}
        </MenuIcon>

        <MenuIcon icon="icon-raids" to="raids" :append="true">
          {{$t("btn-raids")}}
        </MenuIcon>

        <MenuIcon icon="icon-trials" to="trials" :append="true">
          {{$t("btn-trials")}}
        </MenuIcon>
      </MenuIconRow>

      <MenuIconRow>
        <MenuIcon icon="icon-goldExchange" to="gold" :append="true">
          {{$t("btn-goldExchange")}}
        </MenuIcon>

        <MenuIcon icon="icon-tower" to="onyx-tower" :append="true">
          {{$t("btn-tower")}}
        </MenuIcon>

        <MenuIcon icon="icon-adventures" to="adventures" :append="true">
          {{$t("btn-adventures")}}
          <template v-slot:marker>
            <AdventuresMarker></AdventuresMarker>
          </template>
        </MenuIcon>
      </MenuIconRow>

      <MenuIconRow>
        <MenuIcon icon="icon-calendar" to="daily-rewards" :append="true">
          <template v-slot:default>
            {{$t("btn-check-in")}}
          </template>

          <template v-slot:marker>
            <CheckinMarker></CheckinMarker>
          </template>
          
        </MenuIcon>

        <MenuIcon icon="icon-divs" to="dividends" :append="true">
          {{$t("btn-divs")}}
        </MenuIcon>

        <MenuIcon icon="icon-settings" to="settings" :append="true">
          {{$t("btn-settings")}}
        </MenuIcon>
      </MenuIconRow>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import SkewedButton from "@/components/SkewedButton.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import AdventuresMarker from "@/components/Markers/AdventuresMarker.vue";
import CheckinMarker from "@/components/Markers/CheckinMarker.vue";
import MenuIcon from "@/components/MenuIcon.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";

export default {
  name: "home",
  mixins: [AppSection],
  components: {
    SkewedButton,
    IconWithValue,
    AdventuresMarker,
    CheckinMarker,
    MenuIcon,
    MenuIconRow
  },
  created() {
    this.title = this.$t("window-title-home");
  },
  methods: {
    logout() {
      this.$game.logout();
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
  background-image: url("../assets/ui/background_home.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 50vh;
  z-index: 0;
}
</style>

