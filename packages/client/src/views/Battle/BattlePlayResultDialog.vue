<template>
  <UserDialog
    :title="hasWon ? 'You win' : 'You loose'"
    :hideCloseBtn="true"
    :emitClose="true"
    @close="() => {}"
  >
    <template v-slot:content>
      <div class="text-align-center font-size-22">
        <div v-if="crystal || coins || exp || rank">
          <div class="">Rewards</div>
          <div v-if="crystal" class="margin-top-2">
            <div class="flex-inline">
              Crystals:
              <BattleCrystal
                class="margin-left-1 inline-block"
                :value="crystal"
              />
            </div>
          </div>
          <div v-if="coins" class="margin-top-1">
            <div class="flex-inline">
              Coins:
              <BattleCoin
                class="margin-left-1 inline-block"
                :hasMargin="true"
                :value="coins"
              />
            </div>
          </div>
          <div v-if="exp" class="margin-top-1">
            <div class="flex-inline">Experience: {{ exp }}</div>
          </div>
          <div v-if="rank" class="margin-top-1">
            <div class="flex-inline">Rank: {{ rank }}</div>
          </div>
        </div>
        <!-- <div class="margin-top-2 text-align-center">
          <div v-for="(unit, index) in fighters" :key="index">
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
        </div> -->
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
// import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleCrystal from "@/views/Battle/BattleCrystal.vue";
// import ProgressBar from "@/components/ProgressBar.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    // BattleUnit,
    BattleCoin,
    BattleCrystal
    // ProgressBar
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    hasWon() {
      return this.game.combat.result === battle.COMBAT_RESULT_WIN;
    },
    fighters() {
      return this.game.userSquad.fighters || [];
    },
    crystal() {
      return this.game.combat.rewards.crystals || 0;
    },
    coins() {
      return this.game.combat.rewards.coins || 0;
    },
    exp() {
      return this.game.combat.rewards.xp || 0;
    },
    rank() {
      return this.game.combat.rewards.rank || 0;
    }
  },
  methods: {
    nextHandler() {
      if (this.$close) {
        this.$close();
      }

      this.$store.dispatch("battle/exit");

      if (this.$route.name === "battle-adventure-play") {
        this.$router.replace({ name: "battle-adventure" });
      } else {
        this.$router.replace({ name: "battle-menu" });
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
