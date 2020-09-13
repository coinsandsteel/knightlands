<template>
  <div class="screen-content">
    <div class="screen-background" :class="element"></div>
    <UnitView :unit="unit" :showEquipment="false" />
    <Tabs :replace="true" :router="true" :tabs="tabs" :currentTab="currentTab" />
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
    this.title = "window-edit-unit";
    this.$options.useRouterBack = true;
  },
  mounted() {
    this.unit = this.$game.army.getUnit(this.unitId);
  },
  data: () => ({
    unit: null,
    tabs: [
      { title: "level-up", to: { name: "unit-level" } },
      { title: "equipment", to: { name: "unit-equip" } },
      { title: "promotion", to: { name: "unit-promo" } }
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
