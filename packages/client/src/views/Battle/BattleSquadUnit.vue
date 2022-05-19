<template>
  <div>
    <div>
      <BattleUnit />
    </div>
    <div class="battle-squad-unit-info font-size-22 text-align-left">
      <div>Hp - 14</div>
      <div>
        Ability 1
        <ProgressBar
          v-model="expValue"
          :expand="false"
          height="2rem"
          class="full-flex"
          barType="green"
          :maxValue="10"
          :plusButton="'green'"
          @refill="refillHandler"
        ></ProgressBar>
      </div>
      <div>Damage - 6</div>
      <div>
        Ability 2
        <ProgressBar
          v-model="expValue"
          :expand="false"
          height="2rem"
          class="full-flex"
          barType="green"
          :maxValue="10"
          :plusButton="'green'"
          @refill="refillHandler"
        ></ProgressBar>
      </div>
      <div>Defense - 3</div>
      <div>
        Ability 3
        <ProgressBar
          v-model="expValue"
          :expand="false"
          height="2rem"
          class="full-flex"
          barType="green"
          :maxValue="10"
          :plusButton="'green'"
          @refill="refillHandler"
        ></ProgressBar>
      </div>
      <div>Speed - 14</div>
      <div></div>
      <div>Initiative - 14</div>
      <div></div>
      <div class="col-span-2">
        Exp:
        <ProgressBar
          v-model="expValue"
          :expand="false"
          height="2rem"
          class="full-flex"
          barType="green"
          :maxValue="10"
          :plusButton="'green'"
          @refill="refillHandler"
        ></ProgressBar>
      </div>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleLevelUpConfirm from "@/views/Battle/BattleLevelUpConfirm.vue";
export default {
  components: {
    BattleUnit
  },
  data() {
    return {
      expValue: 0
    };
  },
  methods: {
    async refillHandler() {
      const show = create(BattleLevelUpConfirm);
      await show();
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit {
  width: 100px;
  margin: 0 auto;
}
.battle-squad-unit-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
</style>
