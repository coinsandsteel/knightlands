<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
    <div v-bar>
      <div class="flex flex-column">
        <AccessoryTemplatesList
          v-for="rarity in rarities"
          :key="rarity"
          :rarity="rarity"
          :ring="isRing"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import AccessoryTemplatesList from "./AccessoryTemplatesList.vue";
import Rarity from "@/../../knightlands-shared/rarity";

const Rings = "rings";
const Necklace = "necklaces";

export default {
  mixins: [AppSection],
  components: { AccessoryTemplatesList, Tabs },
  created() {
    this.title = "win-craft-acc";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    rarities: Rarity,
    tabs: [
      { title: Rings, value: Rings },
      { title: Necklace, value: Necklace }
    ],
    currentTab: Rings
  }),
  computed: {
    isRing() {
      return this.currentTab == Rings;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
</script>
