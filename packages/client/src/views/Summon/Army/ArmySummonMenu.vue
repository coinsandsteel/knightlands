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
import ArmySummonMeta from "@/army_summon_meta";
import ArmySummonType from "@/../../knightlands-shared/army_summon_type";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  created() {
    this.title = "army-gate";
  },
  components: { Title, ArmySummonElement },
  data: () => ({
    ArmySummonType,
    basicSummon: {},
    advancedSummon: {}
  }),
  mounted() {
    this.update();
  },
  methods: {
    async purchaseSummon(summonType, iap) {
      const results = await this.performRequest(
        this.$game.summonUnits(iap, summonType)
      );
      this.showSummoning(results);
      this.update();
    },
    async summon(summonType, count) {
      let results = await this.performRequest(
        this.$game.summonUnits(null, summonType, count)
      );
      this.showSummoning(results);
      this.update();
    },
    async update() {
      this.basicSummon = { meta: ArmySummonMeta.normalSummon, lastSummon: 0 };
      this.advancedSummon = {
        meta: ArmySummonMeta.advancedSummon,
        lastSummon: 0
      };

      const info = await this.$game.getArmySummonInfo();
      if (info) {
        this.$set(
          this.basicSummon,
          "lastSummon",
          info.lastSummon[ArmySummonType.Normal] || 0
        );
        this.$set(
          this.advancedSummon,
          "lastSummon",
          info.lastSummon[ArmySummonType.Advanced] || 0
        );
      }
    },
    showSummoning(units) {
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
