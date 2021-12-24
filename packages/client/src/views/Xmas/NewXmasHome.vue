<template>
  <div class="screen-content flex-end flex-items-center full-flex">
    <div class="home-art screen-background"></div>
    <div class="width-100" v-bar ref="scroll">
      <div class="width-100">
        <div
          class="flex flex-column min-height-100 width-100 flex-space-between"
        >
          <div class="flex flex-column">
            <MenuIconRow>
              <ConcstructElement initialBuildingType="1" />

              <ConcstructElement initialBuildingType="2" />

              <ConcstructElement initialBuildingType="3" />
            </MenuIconRow>

            <MenuIconRow>
              <ConcstructElement initialBuildingType="4" />

              <ConcstructElement initialBuildingType="5" />

              <ConcstructElement initialBuildingType="6" />
            </MenuIconRow>

            <MenuIconRow>
              <ConcstructElement initialBuildingType="7" />

              <ConcstructElement initialBuildingType="8" />

              <ConcstructElement initialBuildingType="9" />
            </MenuIconRow>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
// import AdventuresMarker from "@/components/Markers/Home/AdventuresMarker.vue";
// import CheckinMarker from "@/components/Markers/Home/CheckinMarker.vue";
// import DailyTasksMarker from "@/components/Markers/Home/DailyTasksMarker.vue";
// import GoldMinesMarker from "@/components/Markers/Home/GoldMinesMarker.vue";
// import OnyxTowerMarker from "@/components/Markers/Home/OnyxTowerMarker.vue";
// import TrialsMarker from "@/components/Markers/Home/TrialsMarker.vue";

// import MenuIcon from "@/components/MenuIcon.vue";
// import MenuIconRow from "@/components/MenuIconRow.vue";

// import PrizePoolWidget from "@/views/Rankings/PrizePool/PrizePoolWidget.vue";
import ConcstructElement from "./ConstructElement";
export default {
  props: ["scrollToBottom"],
  mixins: [AppSection],
  components: {
    // TrialsMarker,
    // OnyxTowerMarker,
    // AdventuresMarker,
    // CheckinMarker,
    // MenuIcon,
    // MenuIconRow,
    // GoldMinesMarker,
    // DailyTasksMarker,
    ConcstructElement
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

.card {
  background-color: dodgerblue;
  color: white;
  padding: 1rem;
  height: 4rem;
}

.cards {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
