<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div v-bar>
      <div>
        <div class="summon-panel">
          <Title :stackBottom="true">{{$t("basic-summon")}}</Title>
          <div class="side-grid">
            <img src="../../../assets/backgrounds/basic_summon.png" />

            <ArmySummonElement :info="basicSummon" />
          </div>
        </div>

        <div class="summon-panel">
          <Title :stackBottom="true">{{$t("advanced-summon")}}</Title>
          <div class="side-grid">
            <img src="../../../assets/backgrounds/advanced_summon.png" />

            <ArmySummonElement :info="advancedSummon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import ArmySummonElement from "./ArmySummonElement.vue";
import Title from "@/components/Title.vue";
import ArmySummonMeta from "@/army_summon_meta";
import ArmySummonType from "@/../knightlands-shared/army_summon_type";

const BasicSummon = "basic";
const AdvancedSummon = "advanced";

export default {
  mixins: [AppSection],
  created() {
    this.title = "army-gate";
  },
  components: { Title, ArmySummonElement },
  data: () => ({
    tabs: [
      { title: "basic-summon", value: BasicSummon },
      { title: "advanced-summon", value: AdvancedSummon }
    ],
    currentTab: BasicSummon,
    basicSummon: {},
    advancedSummon: {}
  }),
  mounted() {
    this.update();
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    async update() {
      this.basicSummon = { meta: ArmySummonMeta.normalSummon, lastSummon: 0 };
      this.advancedSummon = {
        meta: ArmySummonMeta.advancedSummon,
        lastSummon: 0
      };

      const info = await this.$game.getArmySummonInfo();
      console.log(info);
      if (info) {
        this.$set(
          this.basicSummon,
          "lastSummon",
          info.lastSummon[ArmySummonType.Normal]
        );
        this.$set(
          this.advancedSummon,
          "lastSummon",
          info.lastSummon[ArmySummonType.Advanced]
        );
      }
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
