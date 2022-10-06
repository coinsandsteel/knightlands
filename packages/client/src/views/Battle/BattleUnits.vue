<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <!-- <tabs
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
      </tabs> -->
      <div class="screen-content">
        <div
          class="font-size-22 height-100 padding-left-2 padding-right-2 padding-top-1 padding-bottom-1"
        >
          <div>
            <BattleUnitList
              :units="units"
              :isQuantityVisible="true"
              @click="clickHandler"
            />
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
      <CustomButton type="grey" @click="showUnitsFilter"
        >{{ $t("btn-filter") }} {{ hasFilters ? "*" : "" }}</CustomButton
      >
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
// import Tabs from "@/components/Tabs.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import BattleUnitsFilter from "@/views/Battle/BattleUnitsFilter.vue";
// import BattleMixin from "@/views/Battle/BattleMixin.vue";

// const SquadTab = "battle-squad-home";
// const WarehouseTab = "battle-units";
// const BonusTab = "battle-squad-bonus";

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    ActivityMixin
    // BattleMixin
  ],
  components: {
    // Tabs,
    BattleUnitList
  },
  data() {
    return {
      // currentTab: SquadTab
    };
  },
  computed: {
    ...mapState("battle", [
      "game",
      "inventory",
      "mergerIds",
      "selectedTiersFilter",
      "selectedClassesFilter",
      "selectedTribesFilter"
    ]),
    // tabs() {
    //   return [
    //     {
    //       title: "Squad",
    //       value: SquadTab,
    //       to: { name: SquadTab }
    //     },
    //     this.$route.query && this.$route.query.from === "battle-squad-home"
    //       ? {
    //           title: "Warehouse",
    //           value: WarehouseTab,
    //           to: { name: WarehouseTab, query: { from: "battle-squad-home" } }
    //         }
    //       : {
    //           title: "Warehouse",
    //           value: WarehouseTab,
    //           to: {
    //             name: WarehouseTab,
    //             query: { from: "battle-squad-bonus" }
    //           }
    //         },
    //     {
    //       title: "Bonus",
    //       value: BonusTab,
    //       to: { name: BonusTab }
    //     }
    //   ];
    // },
    shouldShowFilter() {
      return true;
    },
    hasFilters() {
      return (
        this.selectedTiersFilter.length +
          this.selectedClassesFilter.length +
          this.selectedTribesFilter.length >
        0
      );
    },
    shouldFillSlot() {
      return this.$route.params && this.$route.params.slot;
    },
    units() {
      return this.inventory.slice().filter(unit => {
        let isIncluded = true;

        if (isIncluded && this.selectedTiersFilter.length > 0) {
          isIncluded =
            isIncluded && this.selectedTiersFilter.includes(unit.tier);
        }

        if (isIncluded && this.selectedClassesFilter.length > 0) {
          isIncluded =
            isIncluded && this.selectedClassesFilter.includes(unit.class);
        }

        if (isIncluded && this.selectedTribesFilter.length > 0) {
          isIncluded =
            isIncluded && this.selectedTribesFilter.includes(unit.tribe);
        }

        if (isIncluded && this.shouldFillSlot) {
          if (this.$route.params.slot === "squad") {
            const ids = [];
            ids.push(
              ...(this.game &&
              this.game.userSquad &&
              this.game.userSquad.fighters
                ? this.game.userSquad.fighters
                : []
              ).map(fighter => fighter && fighter.unitId)
            );
            isIncluded =
              isIncluded &&
              unit.quantity > ids.filter(id => id === unit.unitId).length;
          } else if (this.$route.params.slot === "merger") {
            isIncluded = isIncluded && unit.tier < 3 && unit.quantity >= 3;
          }
        }

        return isIncluded;
      });
    }
  },
  activated() {
    this.title = this.shouldFillSlot ? "select unit" : "inventory";
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
