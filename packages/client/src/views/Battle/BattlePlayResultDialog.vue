<template>
  <UserDialog
    :title="hasWon ? 'You win' : 'You loose'"
    :hideCloseBtn="true"
    @close="nextHandler"
  >
    <template v-slot:content>
      <div class="text-align-center font-size-22">
        <div class="">Rewards</div>
        <div class="margin-top-2">
          <div class="flex-inline">
            Crystals:
            <BattleCrystal class="margin-left-1 inline-block" :value="123" />
          </div>
        </div>
        <div class="margin-top-1">
          <div class="flex-inline">
            Coins:
            <BattleCoin
              class="margin-left-1 inline-block"
              :hasMargin="true"
              :value="123"
            />
          </div>
        </div>
        <div class="margin-top-2 text-align-center">
          <div v-for="(unit, index) in units" :key="index">
            <div class="flex-inline flex-item-center">
              <BattleUnit :unit="unit" />
              <div class="flex-grow-1 margin-left-2">
                <progress-bar
                  ref="energy"
                  :maxValue="456"
                  :value="123"
                  :hideMaxValue="true"
                  :expand="false"
                  barType="green"
                  class="battle-unit-experience pointer"
                ></progress-bar>
              </div>
            </div>
          </div>
        </div>
        <div class="text-align-center">
          <CustomButton
            type="yellow"
            class="inline-block margin-right-2 margin-top-4"
            width="15rem"
            @click="nextHandler"
          >
            Next
          </CustomButton>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapState } from "vuex";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnit,
    BattleCoin,
    BattleCrystal,
    ProgressBar
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    hasWon() {
      return this.game.combat.result === battle.COMBAT_RESULT_WIN;
    },
    units() {
      return this.game.userSquad.units || [];
    }
  },
  methods: {
    nextHandler() {
      this.$store.dispatch("battle/exit");
      this.$router.replace({ name: "battle-menu" });

      if (this.$close) {
        this.$close();
      }
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit-experience {
  width: 30rem;
}
.battle-unit {
  width: 7rem;
}
</style>
