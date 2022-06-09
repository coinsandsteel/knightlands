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
          :disabled="!game.isAdventureHardDifficultyAvailable"
          @click="handleClose(GAME_DIFFICULTY_HIGH)"
          >{{ $t(GAME_DIFFICULTY_HIGH) }}</CustomButton
        >
        <div
          v-if="!game.isAdventureHardDifficultyAvailable"
          class="font-size-18 font-shadow rarity-mythical"
        >
          Finish medium difficulty to unlock.
        </div>
      </div>
    </template>
    <!-- <template v-slot:footer>
      <CustomButton type="yellow" @click="handleClose">{{
        $t("normal???")
      }}</CustomButton>
    </template> -->
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
    ...mapState("battle", ["game"])
  },
  methods: {
    handleClose(result) {
      this.$close(result);
      // @todo call operation
    }
  }
};
</script>
<style scoped lang="less"></style>
