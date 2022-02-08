<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <div>statistic</div>
    <div class="flex-full">
      cards
    </div>
    <div class="padding-top-5 padding-bottom-5">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="showMiniGame"
      >
        Mini game???
      </CustomButton>
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="$emit('next')"
      >
        Finish???
      </CustomButton>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import MarchPlayMiniGame from "@/views/March/MarchPlayMiniGame.vue";
export default {
  data() {
    return {};
  },
  mounted() {
    this.showMiniGame();
  },
  methods: {
    async showMiniGame() {
      const showMiniGameDialog = create(MarchPlayMiniGame);
      const result = await showMiniGameDialog();
      console.log("result", result);
    }
  }
};
</script>
<style scoped lang="less"></style>
