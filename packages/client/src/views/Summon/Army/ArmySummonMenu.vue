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
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";
import Errors from "@/../../knightlands-shared/errors";
import PurchaseArmySlots from "./PurchaseArmySlots.vue";
import { create } from "vue-modal-dialogs";
import ArmyMeta from "@/army_meta.json";

const ShowPurchaseArmySlots = create(PurchaseArmySlots);

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
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
      try {
        let results = await this.performRequestNoCatch(
          this.$game.summonUnits(iap, summonType, count)
        );
        this.showSummoning(results);
        this.update();
      } catch (exc) {
        if (exc.includes(Errors.NotEnoughArmySlots)) {
          let availableSlots = Math.max(
            this.$game.army.maxSlots - this.$game.army.currentSlots,
            0
          );

          if (this.$game.army.maxSlots < ArmyMeta.maxSlots) {
            const response = await this.showPrompt(
              "army-no-slots",
              this.$t("army-p-slots", { count: availableSlots }),
              [
                { type: "green", title: "btn-a-more", response: 2 },
                { type: "red", title: "btn-cancel", response: 1 }
              ]
            );

            if (response == 2) {
              await ShowPurchaseArmySlots();
            }
          } else {
            let requiredSlots = (count || 1) - availableSlots;
            const response = await this.showPrompt(
              "army-no-slots",
              this.$t("army-p-no-slots", {
                count: availableSlots,
                count2: requiredSlots
              }),
              [
                { type: "yellow", title: "dismiss", response: 2 },
                { type: "grey", title: "reserve", response: 3 },
                { type: "red", title: "btn-cancel", response: 1 }
              ]
            );

            if (response == 2) {
              this.$router.push({ name: "units-dismiss" });
            } else if (response == 3) {
              this.$router.push({ name: "units-reserve" });
            }
          }
        }
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
