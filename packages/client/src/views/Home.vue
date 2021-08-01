<template>
  <div class="screen-content flex-end flex-items-center full-flex">
    <div class="home-art screen-background"></div>

    <div class="width-100" v-bar>
      <div
        class="flex flex-column width-100 flex-items-end flex-space-evenly margin-bottom-5"
      >
        <RankingsMenu />
        <MenuIconRow>
          <MenuIcon
            icon="skewed_icon_quest"
            to="daily-tasks"
            :append="true"
            section="dailyTasks"
            >{{ $t("btn-daily-quests") }}

            <template v-slot:marker> <DailyTasksMarker /> </template
          ></MenuIcon>
        </MenuIconRow>

        <MenuIconRow>
          <MenuIcon
            icon="skewed_icon_quests"
            to="quest"
            :append="true"
            id="quests"
            >{{ $t("btn-quests") }}</MenuIcon
          >

          <MenuIcon
            icon="skewed_icon_raids"
            to="raids"
            :append="true"
            section="raids"
            id="raids"
            >{{ $t("btn-raids") }}</MenuIcon
          >

          <MenuIcon
            icon="skewed_icon_portal"
            to="trials"
            :append="true"
            section="trials"
            >{{ $t("btn-trials") }}

            <template v-slot:marker> <TrialsMarker></TrialsMarker> </template
          ></MenuIcon>
        </MenuIconRow>

        <MenuIconRow>
          <MenuIcon
            icon="skewed_icon_mines"
            to="gold-mine"
            :append="true"
            id="gold-mine"
            section="goldMines"
          >
            <template v-slot:default>
              {{ $t("gold-mine") }}
            </template>

            <template v-slot:marker>
              <GoldMinesMarker></GoldMinesMarker>
            </template>
          </MenuIcon>

          <MenuIcon
            icon="skewed_icon_tower"
            to="onyx-tower"
            :append="true"
            section="onyxTower"
            id="onyx-tower"
            >{{ $t("btn-tower") }}
            <template v-slot:marker>
              <OnyxTowerMarker></OnyxTowerMarker> </template
          ></MenuIcon>

          <MenuIcon
            icon="skewed_icon_adventures"
            to="adventures"
            id="adventures"
            :append="true"
            section="adventures"
          >
            {{ $t("btn-adventures") }}
            <template v-slot:marker>
              <AdventuresMarker></AdventuresMarker>
            </template>
          </MenuIcon>
        </MenuIconRow>

        <MenuIconRow>
          <MenuIcon
            icon="skewed_icon_calendar"
            to="daily-rewards"
            :append="true"
            section="dailyReward"
            id="daily-r"
          >
            <template v-slot:default>
              {{ $t("btn-check-in") }}
            </template>

            <template v-slot:marker>
              <CheckinMarker></CheckinMarker>
            </template>
          </MenuIcon>

          <MenuIcon
            icon="skewed_icon_dividents"
            to="dividends"
            :append="true"
            section="dividends"
            id="divs"
          >
            {{ $t("btn-divs") }}
          </MenuIcon>

          <MenuIcon icon="skewed_icon_settings" to="settings" :append="true">
            {{ $t("btn-settings") }}
          </MenuIcon>
        </MenuIconRow>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import AdventuresMarker from "@/components/Markers/Home/AdventuresMarker.vue";
import CheckinMarker from "@/components/Markers/Home/CheckinMarker.vue";
import DailyTasksMarker from "@/components/Markers/Home/DailyTasksMarker.vue";
import GoldMinesMarker from "@/components/Markers/Home/GoldMinesMarker.vue";
import OnyxTowerMarker from "@/components/Markers/Home/OnyxTowerMarker.vue";
import TrialsMarker from "@/components/Markers/Home/TrialsMarker.vue";

import MenuIcon from "@/components/MenuIcon.vue";
import MenuIconRow from "@/components/MenuIconRow.vue";
import RankingsMenu from "./Rankings/RankingsMenu.vue";

export default {
  name: "home",
  mixins: [AppSection],
  components: {
    TrialsMarker,
    OnyxTowerMarker,
    AdventuresMarker,
    CheckinMarker,
    MenuIcon,
    MenuIconRow,
    RankingsMenu,
    GoldMinesMarker,
    DailyTasksMarker
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
  background-image: url("../assets/backgrounds/castle_bg.jpg");
  background-size: cover;
  background-position: center;
}
</style>
