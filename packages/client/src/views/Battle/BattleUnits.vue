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

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, ActivityMixin],
  components: { BattleUnitList },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", [
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
      // for (let i = 0; i < 42; i++) {
      //   result.push({
      //     id: i + 1
      //   });
      // }

      return result;
    }
  },
  created() {
    this.title = this.$t("battle-units");
  },
  methods: {
    async clickHandler(unit) {
      if (this.shouldFillSlot) {
        console.log("fillSquadSlot", {
          unitId: unit.unitId,
          index: this.$route.params.index
        });
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
      console.log("showUnitsFilter");
      const show = create(BattleUnitsFilter);
      await show();
    },
    handleBackButton() {
      this.$router.replace({ name: "battle-squad-home" });
      return true;
    }
  }
};
</script>
<style scoped lang="less"></style>
