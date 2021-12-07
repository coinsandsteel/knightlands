<template>
  <div class="building building-tower font-size-25" :style="towerStyle" @click="handleClick">
    TOWER<br />
    Exp: {{ expirienceValueFormatted }}<br />
    Level: {{ tower.level }}
    <progress-bar
      class="farm-progress-bar"
      ref="progress"
      barClasses="no-animation"
      :maxValue="100"
      :percentMode="false"
      :hideMaxValue="false"
      v-model="tower.currentLevelPercentage"
      barType="green"
    ></progress-bar>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import IncomeText from "./IncomeText.vue";
import { mapState } from "vuex";

import { abbreviateNumber } from "../../../../knightlands-shared/xmas";

export default {
  props: ["tier"],
  components: {
    IncomeText,
    ProgressBar
  },
  data: () => ({}),
  computed: {
    expirienceValueFormatted() {
      return abbreviateNumber(this.tower.expirience);
    },
    towerStyle() {
      return {};
    },
    ...mapState({
      tower: state => state.xmas.tower
    })
  },
  methods: {
    handleClick() {
      this.$store.dispatch("xmas/toggleFlag", "perks");
    }
  }
};
</script>

<style lang="less" scoped>
.building {
  position: relative;
  text-align: center;
  color: black;
  margin-bottom: 5rem;
}
.building-tower {
  background: coral;
  padding: 5rem 0;
}
.progress-bar {
  position: absolute;
  bottom: 0;
}
</style>
