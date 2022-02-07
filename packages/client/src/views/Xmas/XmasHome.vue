<template>
  <div class="screen-content flex-items-center full-flex">
    <Tabs
      :tabs="tabs"
      :currentTab="currentTab"
      @onClick="switchTab"
      v-if="!perksVisible"
    />
    <Background />
    <keep-alive>
      <XmasMap v-if="!perksVisible && isMapMode" @build="goToBuild"></XmasMap>
      <XmasCPoints v-else-if="!perksVisible"></XmasCPoints>
    </keep-alive>

    <XmasPerks v-if="perksVisible" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

// import CustomButton from "@/components/Button.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import Tabs from "@/components/Tabs.vue";

import Background from "./Background.vue";
import XmasMap from "./XmasMap.vue";
import XmasPerks from "./XmasPerks.vue";
import XmasCPoints from "./XmasCPoints.vue";
import SlotPerks from "./SlotPerks.vue";
import { create } from "vue-modal-dialogs";

const ShowSlotPerks = create(SlotPerks, "tier");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, PromptMixin],
  components: {
    Tabs,
    Background,
    XmasCPoints,
    XmasPerks,
    XmasMap
  },
  data: () => ({
    tabs: [
      {
        value: "collect",
        title: "Collect",
        to: {
          name: "xmas-map"
        }
      },
      {
        value: "build",
        title: "Build",
        to: {
          name: "unit-equip"
        }
      },
      {
        value: "cp",
        title: "Xmas points",
        to: {
          name: "unit-promo"
        }
      }
    ],
    currentTab: "collect"
  }),
  created() {
    this.title = "w-xmas";
    this.switchTab(this.currentTab);
    this.$store.$app.$on("show-slot-perks", this.showSlotPerks.bind(this));
  },
  beforeDestroy() {
    this.$store.$app.$off("show-slot-perks");
  },
  computed: {
    isMapMode() {
      return this.currentTab != "cp";
    },
    ...mapState({
      area: state => state.xmas.area,
      user: state => state.xmas.user,
      perksVisible: state => state.xmas.flags.perks
    }),
    ...mapGetters({
      playerStats: "xmas/playerStats"
    })
  },
  methods: {
    showSlotPerks(tier) {
      ShowSlotPerks(tier);
    },
    goToBuild() {
      this.switchTab("build");
    },
    switchTab(newTab) {
      if (newTab != "cp") {
        this.$store.dispatch(
          "xmas/updateMode",
          newTab === "collect" ? "collect" : "manage"
        );
      }
      this.currentTab = newTab;
    }
  }
};
</script>
