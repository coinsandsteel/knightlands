<template>
  <div class="height-100">
    <div class="flex-full flex flex-column flex-center height-100">
      <div class="flex flex-center">
        <div>
          <div
            v-for="(unit, index) in units"
            :key="index"
            class="material-cell pointer"
          >
            <div class="horizontal-line" />
            <div class="vertical-line" />
            <BattleUnit :unit="unit" @click="unitClickHandler(index)" />
          </div>
        </div>
        <div class="material-cell--right relative">
          <div class="horizontal-line horizontal-line--right" />
          <BattleUnit :unit="newUnit" />
        </div>
      </div>
      <div class="margin-top-2">
        <!-- <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="detailsClickHandler"
        >
          Details
        </CustomButton> -->

        <CustomButton
          type="blue"
          class="inline-block margin-right-2 margin-top-1"
          width="12rem"
          @click="clearHandler"
        >
          Clear
        </CustomButton>
        <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          width="12rem"
          :disabled="!canMerge"
          @click="mergeHandler"
        >
          Merge
        </CustomButton>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
// import cloneDeep from "lodash/cloneDeep";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import AppSection from "@/AppSection.vue";
import BattleUnitDetailsDialog from "@/views/Battle/BattleUnitDetailsDialog.vue";
// import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
// import BattleMergerDetailsInfo from "@/views/Battle/BattleMergerDetailsInfo.vue";
// import { create } from "vue-modal-dialogs";

export default {
  mixins: [AppSection],
  components: {
    BattleUnit
  },
  data() {
    return {
      // selectedUnits: [null, null, null]
      // units: [],
      newUnit: null
    };
  },
  computed: {
    ...mapGetters("battle", ["mergerUnits"]),
    units() {
      return this.mergerUnits;
    },
    canMerge() {
      return this.mergerUnits.filter(Boolean).length === 3;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!(to && to.name === "battle-units")) {
      this.reset();
      this.$store.dispatch("battle/clearMergeUnits");
    }
    next();
  },
  activated() {
    this.title = this.$t("Merger");
  },
  methods: {
    reset() {
      this.newUnit = null;
      // this.units = [];
    },
    async unitClickHandler() {
      // const show = create(BattleUnitSelect);
      // await show();
      this.reset();
      this.$router.push({
        name: "battle-units",
        params: {
          slot: "merger"
        }
      });
    },
    clearHandler() {
      this.$store.dispatch("battle/clearMergeUnits");
      this.reset();
    },
    async showUnitDetails(unit) {
      const show = create(
        BattleUnitDetailsDialog,
        "unit",
        "isSelectButtonVisible"
      );
      return show(unit, false);
    },
    async mergeHandler() {
      if (!this.canMerge) {
        return;
      }
      // this.units = cloneDeep(this.mergerUnits);
      const newUnit = await this.$store.dispatch("battle/mergeUnits");
      this.newUnit = newUnit;
      setTimeout(async () => {
        await this.showUnitDetails(newUnit);
        this.clearHandler();
      }, 500);
    }
    // async detailsClickHandler() {
    //   const show = create(BattleMergerDetailsInfo);
    //   await show();
    // }
  }
};
</script>
<style scoped lang="less">
.battle-unit {
  width: 80px;
}
.material-cell {
  position: relative;
  padding: 0 20px 0 0;
}
.material-cell--right {
  padding: 0 0 0 20px;
}
.horizontal-line {
  width: 50px;
  height: 2px;
  background: #000;
  position: absolute;
  top: 50%;
  right: 0;
}
.horizontal-line--right {
  right: auto;
  left: 0;
}
.vertical-line {
  width: 2px;
  height: 100%;
  background: #000;
  position: absolute;
  top: 0;
  right: 0;
}
.material-cell:first-child .vertical-line {
  top: 50%;
}
.material-cell:last-child .vertical-line {
  top: -50%;
}
</style>
