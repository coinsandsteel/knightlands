<template>
  <Promised :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <loading-screen :loading="isPending && isDelayOver" :opacity="0.4"></loading-screen>
      <div class="screen-content">
        <div class="screen-background"></div>

        <div v-bar>
          <div>
            <div class="summon-panel">
              <Title :stackBottom="true">{{ $t("basic-summon") }}</Title>
              <div class="side-grid">
                <img src="../../../assets/backgrounds/basic_summon.png" />

                <ArmySummonElement
                  :info="basicSummon"
                  :summonType="ArmySummonType.Normal"
                  @freeSummon="freeSummon"
                />
              </div>
            </div>

            <div class="summon-panel">
              <Title :stackBottom="true">{{ $t("advanced-summon") }}</Title>
              <div class="side-grid">
                <img src="../../../assets/backgrounds/advanced_summon.png" />

                <ArmySummonElement :info="advancedSummon" :summonType="ArmySummonType.Advanced" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import { Promised } from "vue-promised";
import AppSection from "@/AppSection.vue";
import ArmySummonElement from "./ArmySummonElement.vue";
import Title from "@/components/Title.vue";
import ArmySummonMeta from "@/army_summon_meta";
import ArmySummonType from "@/../knightlands-shared/army_summon_type";
import LoadingScreen from "@/components/LoadingScreen.vue";

const BasicSummon = "basic";
const AdvancedSummon = "advanced";

export default {
  mixins: [AppSection],
  created() {
    this.title = "army-gate";
  },
  components: { Title, ArmySummonElement, Promised, LoadingScreen },
  data: () => ({
    ArmySummonType,
    tabs: [
      { title: "basic-summon", value: BasicSummon },
      { title: "advanced-summon", value: AdvancedSummon }
    ],
    currentTab: BasicSummon,
    basicSummon: {},
    advancedSummon: {},
    request: null
  }),
  mounted() {
    this.update();
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    async freeSummon(summonType) {
      this.request = this.$game.summonUnits(null, summonType);
      let results = await this.request;
      console.log(results);
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
