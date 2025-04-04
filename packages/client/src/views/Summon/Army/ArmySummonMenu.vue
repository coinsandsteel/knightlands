<template>
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
              @summon="summon"
              @purchaseSummon="purchaseSummon"
            />
          </div>
        </div>

        <div class="summon-panel">
          <Title :stackBottom="true">{{ $t("advanced-summon") }}</Title>
          <div class="side-grid">
            <img src="../../../assets/backgrounds/advanced_summon.png" />

            <ArmySummonElement
              :info="advancedSummon"
              :summonType="ArmySummonType.Advanced"
              @summon="summon"
              @purchaseSummon="purchaseSummon"
            />
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
import ArmySummonType from "@/../../knightlands-shared/army_summon_type";
import { mapState } from "vuex";
import ArmySummonerResponseHandler from "./ArmySummonerResponseHandler.vue";

export default {
  mixins: [AppSection, ArmySummonerResponseHandler],
  created() {
    this.title = "army-gate";
  },
  components: { Title, ArmySummonElement },
  data: () => ({
    ArmySummonType
  }),
  computed: mapState({
    basicSummon: state => state.summon.basicSummon,
    advancedSummon: state => state.summon.advancedSummon
  }),
  methods: {
    async purchaseSummon(summonType, iap) {
      await this.doSummon({ summonType, iap });
    },
    async summon(summonType, count) {
      await this.doSummon({ summonType, count });
    },
    async doSummon({ summonType, iap = null, count = 1 }) {
      let results = await this.handleSummon(
        this.$game.summonUnits(iap, summonType, count),
        count
      );

      if (results) {
        this.$app.logEvent("summon-units", {
          summonType,
          iap,
          count
        });

        this.showSummoning(results);
        this.update();
      }
    },
    async update() {
      await this.$game.notifications.updateSummon();
    },
    showSummoning(units) {
      this.$game.handleArmySummoned(units);
      this.$router.push({ name: "army-summon", params: { units } });
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
