<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <div class="flex flex-row flex-no-wrap flex-justify-center font-size-22">
      <div class="padding-right-2">HP???: 8/8</div>
      <div class="padding-right-2 padding-left-2">Armor???: 4</div>
      <div class="padding-left-2">Extra life???: 1</div>
    </div>
    <div class="flex-full flex flex-center width-100">
      <div class="width-100 padding-left-6 padding-right-6">
        <div v-if="cards && cards.length > 0" class="march-cards-container">
          <MarchCard v-for="card in cards" :key="card._id" :card="card" />
        </div>
      </div>
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
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import MarchPlayMiniGame from "@/views/March/MarchPlayMiniGame.vue";
import MarchCard from "@/views/March/MarchCard.vue";
export default {
  components: {
    MarchCard
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("march", ["cards"])
  },
  mounted() {
    // this.showMiniGame();
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
<style scoped lang="less">
.march-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}
.march-card {
  padding-bottom: 100%;
  background: rgba(255, 0, 0, 0.2);
}
</style>
