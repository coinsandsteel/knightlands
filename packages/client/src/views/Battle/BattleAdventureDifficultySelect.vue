<template>
  <UserDialog @close="handleClose" emitClose title="Select difficulty">
    <template v-slot:content>
      <div class="text-align-center">
        <CustomButton
          type="green"
          width="20rem"
          class="inline-block"
          @click="handleClose(DIFFICULTIES.LOW)"
          >{{ $t(DIFFICULTIES.LOW) }}</CustomButton
        >
      </div>
      <div class="text-align-center margin-top-4">
        <CustomButton
          type="yellow"
          width="20rem"
          class="inline-block"
          @click="handleClose(DIFFICULTIES.MEDIUM)"
          >{{ $t(DIFFICULTIES.MEDIUM) }}</CustomButton
        >
      </div>
      <div class="text-align-center margin-top-4">
        <CustomButton
          type="red"
          width="20rem"
          class="inline-block"
          @click="handleClose(DIFFICULTIES.HIGH)"
          >{{ $t(DIFFICULTIES.HIGH) }}</CustomButton
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
      DIFFICULTIES: {
        LOW: battle.GAME_DIFFICULTY_LOW,
        MEDIUM: battle.GAME_DIFFICULTY_MEDIUM,
        HIGH: battle.GAME_DIFFICULTY_HIGH
      }
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
