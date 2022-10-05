<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <tabs
        v-if="
          ['battle-squad-home', 'battle-squad-bonus'].includes(
            $route.query && $route.query.from
          )
        "
        :tabs="tabs"
        :router="true"
        :currentTab="currentTab"
        :replace="true"
      >
      </tabs>
      <div class="screen-content ">
        <div class="font-size-22 height-100">
          <div>
            <BattleUnitList :units="units" @click="clickHandler" />
          </div>
        </div>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="shouldShowFilter && isActive">
      <CustomButton type="green" @click="addUnitHandler">
        Add Unit
      </CustomButton>
      <CustomButton type="red" @click="clearUnitsHandler">
        Clear Units
      </CustomButton>
      <CustomButton type="grey" @click="showUnitsFilter">{{
        $t("btn-filter")
      }}</CustomButton>
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Tabs from "@/components/Tabs.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import BattleUnitsFilter from "@/views/Battle/BattleUnitsFilter.vue";
// import BattleMixin from "@/views/Battle/BattleMixin.vue";

const SquadTab = "battle-squad-home";
const WarehouseTab = "battle-units";
const BonusTab = "battle-squad-bonus";

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    ActivityMixin
    // BattleMixin
  ],
  components: { Tabs, BattleUnitList },
  data() {
    return {
      currentTab: SquadTab
    };
  },
  computed: {
    ...mapState("battle", [
      "game",
      "inventory",
      "mergerIds",
      "selectedTiersFilter",
      "selectedClassesFilter"
    ]),
    tabs() {
      return [
        {
          title: "Squad",
          value: SquadTab,
          to: { name: SquadTab }
        },
        this.$route.query && this.$route.query.from === "battle-squad-home"
          ? {
              title: "Warehouse",
              value: WarehouseTab,
              to: { name: WarehouseTab, query: { from: "battle-squad-home" } }
            }
          : {
              title: "Warehouse",
              value: WarehouseTab,
              to: {
                name: WarehouseTab,
                query: { from: "battle-squad-bonus" }
              }
            },
        {
          title: "Bonus",
          value: BonusTab,
          to: { name: BonusTab }
        }
      ];
    },
    shouldShowFilter() {
      return true;
    },
    shouldFillSlot() {
      return this.$route.params && this.$route.params.slot;
    },
    units() {
      let result = this.inventory.slice();

      if (this.selectedTiersFilter && this.selectedTiersFilter.length > 0) {
        result = result.filter(item =>
          this.selectedTiersFilter.includes(item.tier)
        );
      }

      if (this.selectedClassesFilter && this.selectedClassesFilter.length > 0) {
        result = result.filter(item =>
          this.selectedClassesFilter.includes(item.class)
        );
      }
      console.log("result", result);

      if (this.shouldFillSlot) {
        if (this.$route.params.slot === "squad") {
          const ids = [];
          ids.push(
            ...(this.game && this.game.userSquad && this.game.userSquad.fighters
              ? this.game.userSquad.fighters
              : []
            ).map(unit => unit && unit.unitId)
          );
          result = result.filter(
            ({ unitId, quantity }) =>
              quantity > ids.filter(id => id === unitId).length
          );
        } else if (this.$route.params.slot === "merger") {
          result = result.filter(unit => unit.tier < 3 && unit.quantity >= 3);
        }
      }

      return result;
    }
  },
  activated() {
    this.title = this.shouldFillSlot ? "select unit" : "battle units";
  },
  methods: {
    async clickHandler({ unit }) {
      if (this.shouldFillSlot) {
        if (this.$route.params.slot === "squad") {
          const index = +this.$route.params.index;
          this.$store.dispatch("battle/fillSquadSlot", {
            unitId: unit.unitId,
            index: index >= 0 && index < 5 ? index : 0
          });

          this.$router.replace({
            name: "battle-squad-home"
          });
          return;
        } else if (this.$route.params.slot === "merger") {
          this.$store.dispatch("battle/chooseMergerUnit", {
            unitId: unit.unitId
          });

          this.$router.replace({
            name: "battle-merger"
          });
          return;
        }
      }

      this.$router.push({
        name: "battle-unit-details",
        params: { id: unit.unitId }
      });
    },
    async showUnitsFilter() {
      const show = create(BattleUnitsFilter);
      await show();
    },
    addUnitHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "addUnit"
      });
    },
    clearUnitsHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "clearUnits"
      });
    },
    handleBackButton() {
      // back button
      if (this.$route.query && this.$route.query.from) {
        this.$router.replace({ name: this.$route.query.from });
      } else if (this.shouldFillSlot) {
        if (this.$route.params.slot === "squad") {
          this.$router.replace({ name: "battle-squad-home" });
        } else {
          this.$router.replace({ name: "battle-merger" });
        }
      } else {
        this.$router.replace({ name: "battle-menu" });
      }
      return true;
    }
  }
};
</script>
<style scoped lang="less"></style>
