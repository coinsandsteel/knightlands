<template>
  <div>
    <Title>Adventure item</Title>
    <div class="flex">
      <div>image</div>
      <div class="flex-full">info</div>
      <div>
        <CustomButton
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="clickHandler"
        >
          {{ $t("start") }}???
        </CustomButton>
      </div>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import BattleAdventureDifficultySelect from "@/views/Battle/BattleAdventureDifficultySelect.vue";
export default {
  data() {
    return {};
  },
  methods: {
    async clickHandler() {
      const show = create(BattleAdventureDifficultySelect);
      await show();
    }
  }
};
</script>
<style scoped lang="less"></style>
