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
        <div class="flex flex-items-end">
          <CustomButton
            type="red"
            class="inline-block margin-right-2 margin-top-1"
          >
            {{ $t("btn-expert") }}
          </CustomButton>
          <CustomButton type="yellow" class="inline-block margin-right-1">
            {{ $t("btn-advanced") }}
          </CustomButton>
          <CustomButton
            type="grey"
            class="inline-block margin-right-2 margin-top-1"
          >
            {{ $t("btn-basic") }}
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

const CraftTab = "lunar-craft";
const RecipesTab = "lunar-recipes";
const ExchangeTab = "lunar-exchange";
const NftTab = "lunar-nft";

export default {
  mixins: [AppSection],
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
      currentTab: CraftTab
    };
  },
  created() {
    this.title = this.$t("window-lunar");
  },
  computed: {
    ...mapState({
      loaded: state => state.lunar.loaded
    })
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>
