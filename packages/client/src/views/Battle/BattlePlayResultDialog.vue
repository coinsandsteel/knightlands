<template>
  <UserDialog
    :title="hasWon ? 'You win' : 'You loose'"
    :hideCloseBtn="true"
    @close="nextHandler"
  >
    <template v-slot:content>
      <div class="text-align-center font-size-22">
        <!-- <div>Rewards</div>
        <div>Crystals: 57</div>
        <div>Your rating: 14 (-3)</div> -->
        <div>
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
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnit
  },
  computed: {
    ...mapState("battle", ["game", "user"]),
    hasWon() {
      return this.game.combat.result === battle.COMBAT_RESULT_WIN;
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
