<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div v-bar>
      <div>
        <div class="summon-panel">
          <Title :stackBottom="true">{{$t("basic-summon")}}</Title>
          <div class="side-grid">
            <img src="../../../assets/backgrounds/basic_summon.png" />

            <div class="flex flex-column flex-end padding-bottom-2">
              <CustomButton>Summon x1</CustomButton>
              <CustomButton>Summon x10</CustomButton>
            </div>
          </div>
        </div>

        <div class="summon-panel">
          <Title :stackBottom="true">{{$t("advanced-summon")}}</Title>
          <div class="side-grid">
            <img src="../../../assets/backgrounds/advanced_summon.png" />

            <div class="flex flex-column flex-end padding-bottom-2">
              <CustomButton>Summon x1</CustomButton>
              <CustomButton>Summon x10</CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";

const BasicSummon = "basic";
const AdvancedSummon = "advanced";

export default {
  mixins: [AppSection],
  created() {
    this.title = "army-gate";
  },
  components: { CustomButton, Title },
  data: () => ({
    tabs: [
      { title: "basic-summon", value: BasicSummon },
      { title: "advanced-summon", value: AdvancedSummon }
    ],
    currentTab: BasicSummon
  }),
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

<style lang="less" scoped>
.side-grid {
  display: grid;
  grid-template-columns: 1fr 45%;
  grid-template-rows: 1fr;
  justify-content: stretch;

  & img {
    max-width: 100%;
    grid-column: ~"1/3";
    grid-row: 1;
  }

  & .flex {
    grid-column: 2;
    grid-row: 1;
  }
}

.summon-panel {
  width: 100%;
  position: relative;
}
</style>
