<template>
  <div class="flex flex-column">
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
      <router-view v-if="loaded"></router-view>
      <portal v-if="isActive" to="footer" :slim="true">
        <div class="flex flex-items-start">
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToShop"
          >
            Purchase base elements
          </CustomButton>
        </div>
      </portal>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import LunarDailyRewards from "@/views/Lunar/LunarDailyRewards.vue";
import { create } from "vue-modal-dialogs";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const CraftTab = "lunar-craft";
const RecipesTab = "lunar-recipes";
const ExchangeTab = "lunar-exchange";
const NftTab = "lunar-nft";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    Tabs,
    CustomButton
  },
  async mounted() {
    this.$store.dispatch("lunar/subscribe");
    await this.$store.dispatch("lunar/load");
  },
  beforeDestroy() {
    this.$store.dispatch("lunar/unsubscribe");
  },
  data() {
    return {
      tabs: [
        {
          title: this.$t("tab-craft"),
          value: CraftTab,
          to: { name: CraftTab }
        },
        {
          title: this.$t("tab-recipes"),
          value: RecipesTab,
          to: { name: RecipesTab }
        },
        {
          title: this.$t("tab-exchange"),
          value: ExchangeTab,
          to: { name: ExchangeTab }
        },
        {
          title: this.$t("tab-nft"),
          value: NftTab,
          to: { name: NftTab }
        }
      ],
      currentTab: CraftTab,
      isDailyRewardPopupVisible: false
    };
  },
  created() {
    this.title = this.$t("window-lunar");
    this.$store.$app.$on("lunar-show-daily-reward", this.tryToShowRewards);
  },
  destroyed() {
    this.$store.$app.$off("lunar-show-daily-reward");
  },
  activated() {
    this.tryToShowRewards();
  },
  computed: {
    ...mapState("lunar", ["loaded", "dailyRewards"])
  },
  methods: {
    tryToShowRewards() {
      if (
        this.dailyRewards &&
        this.dailyRewards.find(({ active, collected }) => active && !collected)
      ) {
        this.showDailyRewards();
      }
    },
    async testAction(action) {
      await this.performRequestNoCatch(
        this.$store.dispatch("lunar/testAction", { action })
      );
    },
    async goToShop() {
      this.$router.push({ name: "lunar-shop" });
    },
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    showDailyRewards() {
      const showDailyRewardsDialog = create(LunarDailyRewards);
      showDailyRewardsDialog();
    }
  }
};
</script>
