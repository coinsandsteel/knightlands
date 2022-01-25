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
      <CustomButton
        :disabled="!canSummonCurrentRaid"
        type="yellow"
        @click="summonRaid"
        id="btn-summon"
        >{{ $t("btn-summon") }} {{ limitCount }}</CustomButton
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

const PUBLIC_RAIDS = "pub-raids";
const YOUR_RAIDS = "your-raids";

export default {
  mixins: [AppSection],
  components: { Tabs, CustomButton },
  created() {
    this.title = "raids";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    tabs: [
      {
        title: YOUR_RAIDS,
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
    ],
    currentTab: YOUR_RAIDS
  }),
  computed: {
    ...mapGetters("raids", ["canSummonCurrentRaid", "currentActiveRaids"]),
    limitCount() {
      return `${Math.min(
        this.currentActiveRaids.length,
        UiConstants.maxActiveRaids
      )}/${UiConstants.maxActiveRaids}`;
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
