<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <Tabs
      :replace="true"
      :router="true"
      :tabs="tabs"
      :currentTab="currentTab"
      @onClick="handleTabChanged"
    />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <portal to="footer" v-if="isActive">
      <progress-bar
        class="raid-progress flex-grow-1 padding-left-1 padding-right-1 translate-y--30"
        :maxValue="maxActiveRaids"
        :value="currentActiveRaids.length"
        valueClass="white-font font-outline font-size-20"
        valuePosition="top"
        height="0.5rem"
        :thresholds="thresholds"
        :expand="false"
      >
        <template v-slot:label><span class="margin-right-1">{{$t("active-raids")}}</span></template>
      </progress-bar>
      <CustomButton
        :disabled="!canSummonCurrentRaid"
        type="yellow"
        @click="summonRaid"
        id="btn-summon"
        >{{ $t("btn-summon") }}</CustomButton
      >
    </portal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UiConstants from "@/ui_constants";
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import ProgressBar from "@/components/ProgressBar.vue";

const PUBLIC_RAIDS = "pub-raids";
const YOUR_RAIDS = "your-raids";

export default {
  mixins: [AppSection],
  components: { Tabs, CustomButton, ProgressBar },
  created() {
    this.title = "raids";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    currentTab: YOUR_RAIDS,
    thresholds: UiConstants.raidsSummonProgressThresholds,
    maxActiveRaids: UiConstants.maxActiveRaids
  }),
  computed: {
    ...mapGetters("raids", ["canSummonCurrentRaid", "currentActiveRaids"]),
    tabs() {
      return [
        {
          title: `${this.$t(YOUR_RAIDS)} ${this.limitCount}`,
          to: {
            name: "raids"
          }
        },
        {
          title: PUBLIC_RAIDS,
          to: {
            name: "pub-raids"
          }
        }
      ];
    },
    limitCount() {
      return `${this.currentActiveRaids.length}/${UiConstants.maxActiveRaids}`;
    }
  },
  methods: {
    handleTabChanged(tab) {
      this.currentTab = tab;
    },
    summonRaid() {
      this.$router.push({ name: "raids-for-summon" });
    }
  }
};
</script>
