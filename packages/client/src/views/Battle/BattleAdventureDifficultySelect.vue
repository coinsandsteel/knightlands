<template>
  <UserDialog @close="handleClose" emitClose title="Select difficulty">
    <template v-slot:content>
      <div class="text-align-center margin-top-2">
        <CustomButton
          type="green"
          width="20rem"
          class="inline-block"
          @click="handleClose(GAME_DIFFICULTY_MEDIUM)"
          >{{ $t(GAME_DIFFICULTY_MEDIUM) }}</CustomButton
        >
      </div>
      <div class="text-align-center margin-top-4">
        <CustomButton
          type="blue"
          width="20rem"
          class="inline-block"
          :disabled="!isAdventureHardDifficultyAvailable"
          @click="handleClose(GAME_DIFFICULTY_HIGH)"
          >{{ $t(GAME_DIFFICULTY_HIGH) }}</CustomButton
        >
        <div
          v-if="!isAdventureHardDifficultyAvailable"
          class="font-size-18 font-shadow rarity-mythical"
        >
          Finish medium difficulty to unlock.
        </div>
      </div>
    </template>
  </UserDialog>
</template>
<script>
import { mapState } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  data() {
    return {
      GAME_DIFFICULTY_MEDIUM: battle.GAME_DIFFICULTY_MEDIUM,
      GAME_DIFFICULTY_HIGH: battle.GAME_DIFFICULTY_HIGH
    };
  },
  computed: {
    ...mapState("battle", ["adventures"]),
    isAdventureHardDifficultyAvailable() {
      return this.adventures.locations[this.locationIndex].levels[0][battle.GAME_DIFFICULTY_HIGH];
    }
  },
  methods: {
    handleClose(difficulty) {
      this.$close(difficulty);
      if (difficulty) {
        this.$store.dispatch("battle/setAdventuresDifficulty", {
          difficulty
        });
      }
    }
  }
};
</script>
<style scoped lang="less"></style>
