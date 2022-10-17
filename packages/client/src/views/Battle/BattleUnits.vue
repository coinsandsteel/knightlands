<template>
  <div class="flex flex-column">
    <div class="screen-content">
      <div
        class="font-size-22 height-100 padding-left-2 padding-right-2 padding-top-1 padding-bottom-1"
      >
        <div class="font-size-22 text-align-center margin-bottom-2">
          <div v-if="totalPower && !shouldFillSlot">
            Total power: {{ totalPower }}
          </div>
        </div>
        <!-- <BattleUnitList
              :units="units"
              :isQuantityVisible="true"
              @click="clickHandler"
            /> -->

        <template v-for="(unitGroup, tribe) in unitGroups">
          <div v-if="unitGroup.length > 0" class="margin-bottom-3" :key="tribe">
            <div class="text-align-center font-size-25">
              {{ $t("battle-unit-tribe-name-" + tribe) }}
            </div>
            <div class="battle-units-wrapper margin-top-2">
              <BattleUnit
                v-for="unit in unitGroup"
                :key="unit.unitId"
                :unit="unit"
                :isQuantityVisible="true"
                :shouldExcludeSquadQuantity="shouldExcludeSquadQuantity"
                class="pointer"
                @click="clickHandler(unit)"
              />
              <!-- <div
                v-for="unit in unitGroup"
                :key="unit.unitId"
                class="battle-unit-wrap"
              >
                <BattleUnit
                  :unit="unit"
                  :isQuantityVisible="true"
                  @click="clickUnitHandler"
                />
                <div class="padding-top-1 text-align-center">
                  <CustomButton
                    type="green"
                    :mini="true"
                    class="inline-block"
                    @click="clickDescriptionHandler"
                  >
                    Description
                  </CustomButton>
                </div>
              </div> -->
            </div>
          </div>
        </template>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="shouldShowFilter && isActive">
      <CustomButton type="green" @click="addTopUnitsHandler">
        Add Top Units
      </CustomButton>
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
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import * as battle from "@/../../knightlands-shared/battle";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
// import Tabs from "@/components/Tabs.vue";
// import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import BattleUnitsFilter from "@/views/Battle/BattleUnitsFilter.vue";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitDetailsDialog from "@/views/Battle/BattleUnitDetailsDialog.vue";
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
    // BattleUnitList,
    BattleUnit
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
    ...mapGetters("battle", ["totalPower"]),
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
    shouldExcludeSquadQuantity() {
      return this.shouldFillSlot && this.$route.params.slot === "squad";
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
            // const ids = [];
            // ids.push(
            //   ...(this.game &&
            //   this.game.userSquad &&
            //   this.game.userSquad.fighters
            //     ? this.game.userSquad.fighters
            //     : []
            //   ).map(fighter => fighter && fighter.unitId)
            // );
            // isIncluded =
            //   isIncluded &&
            //   unit.quantity > ids.filter(id => id === unit.unitId).length;
            const templateIds = [];
            templateIds.push(
              ...(this.game &&
              this.game.userSquad &&
              this.game.userSquad.fighters
                ? this.game.userSquad.fighters
                : []
              ).map(fighter => fighter && fighter.unitTemplate)
            );
            isIncluded = isIncluded && !templateIds.includes(unit.template);
          } else if (this.$route.params.slot === "merger") {
            isIncluded = isIncluded && unit.tier < 3 && unit.quantity >= 3;
          }
        }

        return isIncluded;
      });
    },
    unitGroups() {
      const groups = {
        [battle.UNIT_TRIBE_KOBOLD]: [],
        [battle.UNIT_TRIBE_DWARF]: [],
        [battle.UNIT_TRIBE_EGYPTIAN]: [],
        [battle.UNIT_TRIBE_GOBLIN]: [],
        [battle.UNIT_TRIBE_INSECT]: [],
        [battle.UNIT_TRIBE_ORC]: [],
        [battle.UNIT_TRIBE_CLOCKWORK]: [],
        [battle.UNIT_TRIBE_SKELETON]: [],
        [battle.UNIT_TRIBE_ICE]: [],
        [battle.UNIT_TRIBE_ELF]: [],
        [battle.UNIT_TRIBE_ELDRITCH]: [],
        [battle.UNIT_TRIBE_ASSEMBLING]: [],
        [battle.UNIT_TRIBE_FALLEN_KING]: [],
        [battle.UNIT_TRIBE_LEGENDARY]: [],
        [battle.UNIT_TRIBE_TITAN]: []
      };

      for (let i = 0; i < this.units.length; i++) {
        const unit = this.units[i];
        if (groups[unit.tribe]) {
          groups[unit.tribe].push(unit);
        }
      }

      return groups;
    }
  },
  activated() {
    this.title = this.shouldFillSlot ? "select unit" : "inventory";
  },
  methods: {
    async showUnitDetails(unit) {
      const show = create(BattleUnitDetailsDialog, "unit");
      return show(unit);
    },
    async clickHandler(unit) {
      if (this.shouldFillSlot) {
        const result = await this.showUnitDetails(unit);
        if (!result) {
          return;
        }
        if (this.$route.params.slot === "squad") {
          const index = +this.$route.params.index;
          this.$store.dispatch("battle/fillSquadSlot", {
            unitId: unit.unitId,
            index: index >= 0 && index < 5 ? index : 0
          });

          this.$router.replace({
            name: "battle-squad"
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
    addTopUnitsHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "addTopUnits"
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
          this.$router.replace({ name: "battle-squad" });
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
<style scoped lang="less">
.battle-units-wrapper {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  // justify-content: space-between;
}
.battle-unit {
  width: calc(20% - 1rem);
  margin: 0 0.5rem 1rem;
}
// .battle-unit-wrap {
//   width: 25%;
//   margin-bottom: 2rem;
// }
// @media only screen and (min-width: 450px) {
//   .battle-unit-wrap {
//     width: 20%;
//   }
// }
// .battle-unit {
//   width: calc(100% - 1rem);
//   margin: 0 auto;
// }
</style>
