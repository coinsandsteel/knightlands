<template>
  <div class="height-100">
    <div class="flex-full flex flex-column flex-center height-100">
      <div class="flex flex-center">
        <div>
          <div
            v-for="(unit, index) in selectedUnits"
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
          <BattleUnit />
        </div>
      </div>
      <div class="">
        <!-- <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="detailsClickHandler"
        >
          Details
        </CustomButton> -->

        <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
        >
          Merge
        </CustomButton>
      </div>
    </div>
  </div>
</template>
<script>
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitSelect from "@/views/Battle/BattleUnitSelect.vue";
import BattleMergerDetailsInfo from "@/views/Battle/BattleMergerDetailsInfo.vue";
import { create } from "vue-modal-dialogs";

export default {
  components: {
    BattleUnit
  },
  data() {
    return {
      selectedUnits: [null, null, null]
    };
  },
  methods: {
    async unitClickHandler(index) {
      // const show = create(BattleUnitSelect);
      // await show();
      this.$router.push({
        name: "battle-units",
        params: {
          slot: "merger",
          index
        }
      });
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
