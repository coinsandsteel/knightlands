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
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
// import BattleMixin from "@/views/Battle/BattleMixin.vue";

const SquadTab = "battle-squad-home";
const WarehouseTab = "battle-units";
const BonusTab = "battle-squad-bonus";

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin
    //BattleMixin
  ],
  components: {
    Tabs
  },
  data() {
    return {
      currentTab: SquadTab
    };
  },
  computed: {
    tabs() {
      return [
        {
          title: "Squad",
          value: SquadTab,
          to: { name: SquadTab }
        },
        {
          title: "Warehouse",
          value: WarehouseTab,
          to: { name: WarehouseTab, query: { from: this.$route.name } }
        },
        {
          title: "Bonus",
          value: BonusTab,
          to: { name: BonusTab }
        }
      ];
    }
  },
  async mounted() {
    // this.$store.dispatch("battle/subscribe");
    // await this.$store.dispatch("battle/load");
  },
  created() {
    this.title = this.$t("battle-event");
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    handleBackButton() {
      this.$router.replace({ name: "battle-menu" });
      return true;
    }
  }
};
</script>
<style scoped lang="less"></style>
