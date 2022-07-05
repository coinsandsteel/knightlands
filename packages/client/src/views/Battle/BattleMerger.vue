<template>
  <div class="height-100">
    <div class="flex-full flex flex-column flex-center height-100">
      <div class="flex flex-center">
        <div>
          <div class="material-cell">
            <div class="horizontal-line" />
            <div class="vertical-line" />
            <BattleUnit @click="unitClickHandler" />
          </div>
          <div class="material-cell">
            <div class="horizontal-line" />
            <div class="vertical-line" />
            <BattleUnit @click="unitClickHandler" />
          </div>
          <div class="material-cell">
            <div class="horizontal-line" />
            <div class="vertical-line" />
            <BattleUnit @click="unitClickHandler" />
          </div>
        </div>
        <div class="material-cell--right relative">
          <div class="horizontal-line horizontal-line--right" />
          <BattleUnit />
        </div>
      </div>
      <div class="">
        <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="detailsClickHandler"
        >
          {{ $t("details") }}???
        </CustomButton>

        <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
        >
          {{ $t("merger") }}???
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
    return {};
  },
  methods: {
    async unitClickHandler() {
      const show = create(BattleUnitSelect);
      await show();
    },
    async detailsClickHandler() {
      const show = create(BattleMergerDetailsInfo);
      await show();
    }
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
