<template>
  <div
    class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <div
      class="april-play-stat flex flex-row flex-no-wrap flex-justify-center font-size-22 padding-top-2 padding-bottom-2 relative"
    >
      <AprilGold
        class="april-gold--with-background padding-left-2 margin-right-2"
      />
      <AprilPoints class="april-points--with-background padding-left-2" />
      <div class="close-btn" @click="stopHandler"></div>
    </div>

    <div
      class="april-play-board flex-full flex flex-center width-100 overflow-auto"
    >
      play board1111<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board<br />
      play board<br />play board<br />play board2222<br />
    </div>

    <div class="april-play-decks flex flex-center width-100">
      <div class="april-play-deck-1"></div>
      <div class="april-play-deck-2">
        <div
          class="april-cards-container"
          :style="{ 'grid-template-columns': `repeat(${cards.length}, auto)` }"
        >
          <AprilCard
            v-for="(card, cardIndex) in cards"
            :key="cardIndex + '/' + cards.length + '_' + card.id"
            :card="card"
            :index="cardIndex"
            :totalCards="cards.length"
          ></AprilCard>
        </div>
      </div>
      <div class="april-play-deck-3"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilPoints from "@/views/April/AprilPoints.vue";
import AprilStopGame from "@/views/April/AprilStopGame.vue";
import AprilCard from "@/views/April/AprilCard.vue";

export default {
  components: {
    AprilGold,
    AprilPoints,
    AprilCard
  },

  data() {
    return {
      // baseSize: 60
    };
  },

  computed: {
    ...mapState(["appSize"]),
    ...mapGetters("april", ["cards"]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 6)
        : Math.floor(375 / 6);
    }
  },

  mounted() {
    // this.calculateBaseSize();
  },

  methods: {
    async stopHandler() {
      const showDialog = create(AprilStopGame);
      const result = await showDialog();
      if (result) {
        this.$store.dispatch("april/exitGame");
        this.$emit("next", true);
      }
    }
  }
};
</script>

<style scoped lang="less">
.april-play-stat {
  background: #2f7285;
}
.close-btn {
  top: 50%;
  transform: translateY(-50%) scale(0.9);
}
.april-play-decks {
  display: grid;
  grid-template-columns:
    calc(var(--base-size) / 2)
    1fr
    calc(var(--base-size) / 2);
  height: calc(1.5 * var(--base-size) + 3px + 40px);
  padding: 20px 0;
}
.april-play-deck-1,
.april-play-deck-3 {
  background: red;
  opacity: 0.5;
  border-radius: 6px;
  border: 1px solid #fff;
  height: 100%;
}
.april-play-deck-1 {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-left: none;
}
.april-play-deck-2 {
  // overflow-x: hidden;
}
.april-play-deck-3 {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-right: none;
}
.april-cards-container {
  display: grid;
  // grid-template-columns: repeat(5, 1fr);
  justify-content: center;
}
</style>
