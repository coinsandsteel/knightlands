<template>
  <div class="screen-content">
    <div class="element-background" :class="element"></div>
    <UnitView :unit="unit" />
    <Tabs
      :replace="true"
      :router="true"
      :tabs="tabs"
      :currentTab="currentTab"
    />
    <keep-alive v-if="unit">
      <router-view :unit="unit"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import UnitGetterMixin from "../UnitGetterMixin.vue";
import UnitView from "../UnitView.vue";
import Tabs from "@/components/Tabs.vue";

export default {
  mixins: [AppSection, UnitGetterMixin],
  props: ["unitId"],
  components: { Tabs, UnitView },
  created() {
    this.title = "";
    this.$options.useRouterBack = true;
  },
  async mounted() {
    await this.$game.army.load();
    this.unit = this.$game.army.getUnit(this.unitId);
  },
  data: () => ({
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
