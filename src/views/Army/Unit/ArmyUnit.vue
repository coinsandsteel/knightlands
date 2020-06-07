<template>
  <Promised class="screen-content" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <div class="screen-background" :class="element"></div>
      <LoadingScreen :loading="isPending && isDelayOver" />
      <UnitView :unit="unit" />
      <Tabs :replace="true" :router="true" :tabs="tabs" :currentTab="currentTab" />
      <keep-alive v-if="unit">
        <router-view :unit="unit"></router-view>
      </keep-alive>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection";
import UnitGetterMixin from "../UnitGetterMixin.vue";
import UnitView from "../UnitView.vue";
import Tabs from "@/components/Tabs.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  mixins: [AppSection, UnitGetterMixin],
  props: ["unitId"],
  components: { Tabs, UnitView, Promised, LoadingScreen },
  created() {
    this.title = "";
    this.$options.useRouterBack = true;
  },
  async mounted() {
    this.request = this.$game.army.load();
    await this.request;
    this.unit = this.$game.army.getUnit(this.unitId);
  },
  data: () => ({
    request: null,
    unit: null,
    tabs: [
      { title: "level-up", to: { name: "unit-level" } },
      { title: "equipment", to: { name: "unit-equip" } },
      { title: "promotoion", to: { name: "unit-promo" } }
    ],
    currentTab: "level-up"
  }),
  watch: {
    unitId() {
      this.unit = this.$game.army.getUnit(this.unitId);
    }
  }
};
</script>
