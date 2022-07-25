<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
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
import { mapGetters, mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
import BattleUnitsFilter from "@/views/Battle/BattleUnitsFilter.vue";
// import BattleMixin from "@/views/Battle/BattleMixin.vue";

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    ActivityMixin
    // BattleMixin
  ],
  components: { BattleUnitList },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", [
      "game",
      "inventory",
      "selectedTiersFilter",
      "selectedClassesFilter"
    ]),
    shouldShowFilter() {
      return true;
    },
    shouldFillSlot() {
      return (
        this.$route.params &&
        this.$route.params.slot &&
        this.$route.params.index !== null &&
        this.$route.params.index !== undefined
      );
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
          this.selectedClassesFilter.includes(item.unitClass)
        );
      }

      if (this.shouldFillSlot) {
        const squadIds = (this.game &&
        this.game.userSquad &&
        this.game.userSquad.units
          ? this.game.userSquad.units
          : []
        ).map(unit => unit && unit.unitId);

        result = result.filter(({ unitId }) => !squadIds.includes(unitId));
      }

      return result;
    }
  },
  activated() {
    console.log("shouldFillSlot", this.shouldFillSlot);
    this.title = this.shouldFillSlot ? "select unit" : "battle units";
  },
  methods: {
    async clickHandler({ unit }) {
      if (this.shouldFillSlot) {
        this.$store.dispatch("battle/fillSquadSlot", {
          unitId: unit.unitId,
          index: this.$route.params.index
        });

        this.$router.replace({
          name: "battle-squad-home"
        });
        return;
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
        this.$router.replace({ name: "battle-squad-home" });
      } else {
        this.$router.replace({ name: "battle-menu" });
      }
      return true;
    }
  }
};
</script>
<style scoped lang="less"></style>
