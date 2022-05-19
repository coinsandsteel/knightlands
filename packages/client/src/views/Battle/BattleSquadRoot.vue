<template>
  <div class="flex flex-column flex-full overflow-auto">
    <div class="screen-background"></div>
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <tabs
        :tabs="tabs"
        :router="true"
        :currentTab="currentTab"
        @onClick="switchTab"
        :replace="true"
      >
      </tabs>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import { create } from "vue-modal-dialogs";
import Tabs from "@/components/Tabs.vue";
// import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const SquadTab = "battle-squad-home";
const WarehouseTab = "battle-units";
const BonusTab = "battle-squad-bonus";

export default {
  mixins: [
    // AppSection,
    NetworkRequestErrorMixin
  ],
  components: {
    Tabs
  },
  data() {
    return {
      hasShowDailyRewards: false,
      tabs: [
        {
          title: this.$t("squad???"),
          value: SquadTab,
          to: { name: SquadTab }
        },
        {
          title: this.$t("warehouse???"),
          value: WarehouseTab,
          to: { name: WarehouseTab }
        },
        {
          title: this.$t("bonus???"),
          value: BonusTab,
          to: { name: BonusTab }
        }
      ],
      currentTab: SquadTab
    };
  },
  async mounted() {
    // this.$store.dispatch("battle/subscribe");
    // await this.$store.dispatch("battle/load");
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>
<style scoped lang="less"></style>
