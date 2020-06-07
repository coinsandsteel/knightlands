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
                  :fetchRequest="fetchRequest"
                  @summon="summon"
                  @purchaseSummon="purchaseSummon"
                  @continuePurchase="continuePurchase"
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
                  :fetchRequest="fetchRequest"
                  @summon="summon"
                  @purchaseSummon="purchaseSummon"
                  @continuePurchase="continuePurchase"
                />
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
import PaymentHandler from "@/components/PaymentHandler.vue";
import Events from "@/../knightlands-shared/events";

export default {
  mixins: [AppSection, PaymentHandler],
  created() {
    this.title = "army-gate";
    this.$options.paymentEvents = [Events.UnitSummoned];
  },
  components: { Title, ArmySummonElement, Promised, LoadingScreen },
  data: () => ({
    ArmySummonType,
    basicSummon: {},
    advancedSummon: {},
    request: null,
    fetchRequest: null
  }),
  mounted() {
    this.update();
    this.fetchPaymentStatus();
  },
  methods: {
    async fetchPaymentStatus() {
      console.log("fetchPaymentStatus")
      this.fetchRequest = this.$game.fetchArmySummonStatus();
      const r = await this.fetchRequest;
      console.log(r)
    },
    async purchaseSummon(summonType, iap) {
      console.log(iap)
      this.request = this.$game.summonUnits(iap, summonType);
      this.purchaseRequest(this.request);
    },
    async summon(summonType, count) {
      console.log(summonType, count)
      this.request = this.$game.summonUnits(null, summonType, count);

      let results = await this.request;
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
    handlePaymentComplete(iap, context) {
      this.showSummoning(context);
    },
    showSummoning(units) {
      this.$router.push({ name: "army-summon", params: { units } })
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
