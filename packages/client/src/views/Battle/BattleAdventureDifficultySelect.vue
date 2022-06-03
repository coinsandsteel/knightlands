<template>
  <UserDialog @close="handleClose" emitClose title="Select difficulty">
    <template v-slot:content>
      <div class="text-align-center margin-top-2">
        <CustomButton
          type="green"
          width="20rem"
          class="inline-block"
          @click="handleClose(GAME_DIFFICULTY_NORMAL)"
          >{{ $t(GAME_DIFFICULTY_NORMAL) }}</CustomButton
        >
      </div>
      <div class="text-align-center margin-top-4">
        <CustomButton
          type="blue"
          width="20rem"
          class="inline-block"
          @click="handleClose(GAME_DIFFICULTY_HARD)"
          >{{ $t(GAME_DIFFICULTY_HARD) }}</CustomButton
        >
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
import * as battle from "@/../../knightlands-shared/battle";

export default {
  data() {
    return {
      GAME_DIFFICULTY_NORMAL: battle.GAME_DIFFICULTY_NORMAL,
      GAME_DIFFICULTY_HARD: battle.GAME_DIFFICULTY_HARD
    };
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
