<template>
  <div class="screen-content flex-end flex-items-center full-flex">
    <div class="home-art screen-background"></div>

    <div class="width-100 height-100" v-bar ref="scroll">
      <div class="width-100">
        <div
          class="flex flex-column min-height-100 width-100 flex-space-between"
        >
          <div class="flex flex-column">
            <RankingsMenu />
            <Multipliers />
            <progress-bar
              :maxValue="100"
              iconClass="icon-health"
              :hideMaxValue="true"
              plusButton="grey"
              class="flex-full pointer"
            ></progress-bar>
            <MenuIconRow>
              <MenuIcon
                icon="skewed_icon_quest"
                to="daily-tasks"
                :append="true"
                id="daily-tasks"
                section="dailyTasks"
                >{{ $t("btn-daily-quests") }}

                <template v-slot:marker> <DailyTasksMarker /> </template
              ></MenuIcon>

              <MenuIcon
                icon="skewed_icon_tower"
                :to="{ name: 'xmas-home' }"
                :append="true"
                id="xmas"
                >{{ $t("btn-evt-xmas") }}
              </MenuIcon>

              <MenuIcon
                icon="skewed_icon_quests"
                to="quest"
                :append="true"
                id="quests"
                >{{ $t("btn-quests") }}</MenuIcon
              >
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
                id="trials"
                section="trials"
                >{{ $t("btn-trials") }}

                <template v-slot:marker>
                  <TrialsMarker></TrialsMarker> </template
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
                icon="icon-account"
                to="account"
                :append="true"
                section="dividends"
                id="divs"
              >
                {{ $t("btn-divs") }}
              </MenuIcon>

              <MenuIcon
                icon="skewed_icon_settings"
                to="settings"
                :append="true"
              >
                {{ $t("btn-settings") }}
              </MenuIcon>
            </MenuIconRow>
          </div>
        </div>
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

import PrizePoolWidget from "@/views/Rankings/PrizePool/PrizePoolWidget.vue";
import Multipliers from "./NewMultipliers.vue";
import ProgressBar from "@/components/ProgressBar.vue";
export default {
  props: ["scrollToBottom"],
  mixins: [AppSection],
  components: {
    PrizePoolWidget,
    TrialsMarker,
    OnyxTowerMarker,
    AdventuresMarker,
    CheckinMarker,
    MenuIcon,
    MenuIconRow,
    GoldMinesMarker,
    DailyTasksMarker,
    Multipliers,
    ProgressBar
  },
  created() {
    this.title = this.$t("window-title-home");
  },
  watch: {
    scrollToBottom: {
      immediate: true,
      handler() {
        if (this.scrollToBottom) {
          const element = document.querySelector(".vb-content");
          element.scrollTop = element.scrollHeight - element.clientHeight;
        }
      }
    }
  },
  activated() {
    const element = document.querySelector(".vb-content");
    element.scrollTop = element.scrollHeight - element.clientHeight;
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
  background-size: cover;
  background-position: bottom;
}
</style>
