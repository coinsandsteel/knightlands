<template>
  <div>
    <progress-bar
      :maxValue="BATTLE_MAX_ENERGY"
      :value="energy"
      iconClass="icon-energy"
      :hideMaxValue="true"
      :expand="false"
      barType="blue"
      class="pointer width-30"
    ></progress-bar>
    <BattleCoin class="margin-left-2" :hasMargin="true" />
    <BattleCrystal class="margin-left-2" />
    <slot />
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";
import ProgressBar from "@/components/ProgressBar.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";

export default {
  components: {
    BattleCoin,
    BattleCrystal,
    ProgressBar
  },
  data() {
    return {
      BATTLE_MAX_ENERGY: battle.BATTLE_MAX_ENERGY
    };
  },

  computed: {
    ...mapState("battle", ["user"]),
    energy() {
      return this.user.balance.energy;
    }
  }
};
</script>
<style scoped lang="scss"></style>
