<template>
  <div
    class="width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <div
      class="april-play-stat flex flex-row flex-no-wrap flex-justify-center font-size-22 padding-top-2 padding-bottom-2 relative"
    >
      <AprilGold class="april-gold--with-background padding-left-2" />
      <div class="close-btn" @click="stopHandler"></div>
    </div>

    <div
      class="april-play-board-container flex-full flex flex-center width-100 overflow-auto"
    >
      <div
        class="april-play-board-wrapper flex flex-row flex-no-wrap flex-justify-center width-100"
      >
        <div class="step-cells-wrapper flex flex-column margin-right-1">
          <div
            v-for="(cell, cellIndex) in stepCells"
            :key="cellIndex"
            class="step-cell margin-top-1 margin-bottom-1"
          ></div>
        </div>
        <div class="april-play-board-border-outer">
          <div class="april-play-board-border">
            <div class="april-play-board">
              <AprilBoardCell
                v-for="(cell, cellIndex) in boardCells"
                :key="cellIndex"
                :index="cellIndex"
              />
            </div>
          </div>
        </div>
        <div class="hp-cells-wrapper flex flex-column margin-left-1">
          <div
            v-for="(cell, cellIndex) in hpCells"
            :key="cellIndex"
            class="step-hp margin-top-1 margin-bottom-1"
          ></div>
        </div>
      </div>
    </div>

    <div class="april-play-decks flex flex-center width-100">
      <div class="april-play-deck-1"></div>
      <div class="april-play-deck-2">
        <TransitionGroup
          tag="div"
          name="card-move"
          class="april-cards-container relative"
        >
          <AprilCard
            v-for="(card, cardIndex) in currentCards"
            :key="card.id"
            :card="card"
            :index="cardIndex"
            :totalCards="currentCards.length"
          ></AprilCard>
        </TransitionGroup>
      </div>
      <div class="april-play-deck-3"></div>
    </div>

    <div class="width-100 flex flex-items-start">
      <div class="flex-full"></div>
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testDrawCards"
      >
        Draw cards
      </CustomButton>
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testDropCards"
      >
        Drop cards
      </CustomButton>
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testUpdateCells"
      >
        Update cells
      </CustomButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import random from "lodash/random";
import { create } from "vue-modal-dialogs";
import * as april from "@/../../knightlands-shared/april";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilStopGame from "@/views/April/AprilStopGame.vue";
import AprilCard from "@/views/April/AprilCard.vue";
import AprilBoardCell from "@/views/April/AprilBoardCell.vue";

export default {
  components: {
    AprilGold,
    AprilCard,
    AprilBoardCell
  },

  data() {
    return {
      // baseSize: 60
      count: 0,
      currentCards: []
    };
  },

  computed: {
    ...mapState(["appSize"]),
    ...mapGetters("april", ["cards", "damage", "units"]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 6)
        : Math.floor(375 / 6);
    },
    boardCells() {
      return new Array(5 * 5).fill(null);
    },
    stepCells() {
      return new Array(2).fill(null);
    },
    hpCells() {
      return new Array(2).fill(null);
    }
  },

  watch: {
    cards(value) {
      console.log("cards handler");
      this.currentCards = [...value];
    }
  },

  mounted() {
    // this.calculateBaseSize();
    this.currentCards = [...this.cards];
  },

  methods: {
    async stopHandler() {
      const showDialog = create(AprilStopGame);
      const result = await showDialog();
      if (result) {
        this.$store.dispatch("april/exitGame");
        this.$emit("next", true);
      }
    },
    testDrawCards() {
      const cards = [...this.currentCards];
      const num = cards.length <= 0 ? 4 : random(1, 2);
      for (let i = 0; i < num; i++) {
        const card = {
          id: Date.now() + i,
          cardClass:
            april.CARD_CLASSES[random(0, april.CARD_CLASSES.length - 1)]
        };
        cards.push(card);
      }
      this.$store.commit("april/updateState", { cards });
    },
    testDropCards() {
      const num = random(1, 2);
      const cards = [...this.currentCards];
      for (let i = 0; i < num; i++) {
        if (cards.length <= 0) {
          break;
        }
        const index = random(0, cards.length - 1);
        cards.splice(index, 1);
      }
      this.$store.commit("april/updateState", { cards });
    },
    testUpdateCells() {
      this.count++;
      const units2 = {
        wer2s929f: { unitClass: april.UNIT_CLASS_TEETH, index: 6 },
        "32vr45n7u6": { unitClass: april.UNIT_CLASS_TEETH, index: 12 },
        "89mnbv31x": { unitClass: april.UNIT_CLASS_JACK, index: 13 },
        "2n9v38534n": { unitClass: april.UNIT_CLASS_HERO, index: 22 }
      };
      const units1 = {
        wer2s929f: { unitClass: april.UNIT_CLASS_TEETH, index: 9 },
        "32vr45n7u6": { unitClass: april.UNIT_CLASS_TEETH, index: 10 },
        "89mnbv31x": { unitClass: april.UNIT_CLASS_JACK, index: 3 },
        "2n9v38534n": { unitClass: april.UNIT_CLASS_HERO, index: 17 }
      };
      const damage1 = [
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        2,
        2,
        0,
        1,
        2,
        2,
        1,
        1,
        0,
        1,
        1,
        2,
        0,
        0,
        0,
        0,
        0,
        0
      ];
      const damage2 = [
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        2,
        2,
        0,
        1,
        0,
        0,
        1,
        1,
        0,
        1,
        1,
        2,
        0,
        0,
        2,
        0,
        2,
        3
      ];
      this.$store.commit("april/updateState", {
        units: this.count % 2 ? units2 : units1,
        damage: this.count % 2 ? damage2 : damage1
      });
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
  background: url("/images/april/card_back.svg") center/70% repeat #3b3f65;
  // opacity: 0.5;
  border-radius: 6px;
  border: 1px solid #fff;
  height: 100%;
  z-index: 10;
  position: relative;
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
  height: calc(var(--base-size) * 1.5);
  background: rgba(red, 30%);
}
.step-cell,
.step-hp {
  width: calc(var(--base-size) * 0.5);
  height: calc(var(--base-size) * 0.5);
}
.step-cell {
  background: url("/images/april/move.png") center/100% no-repeat;
}
.step-hp {
  background: url("/images/april/hp.png") center/100% no-repeat;
}
.april-play-board {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--base-size) * 0.8));
}
.april-play-board-border-outer {
  border: 1px solid #555;
  border-radius: 4px;
}
.april-play-board-border {
  border: 4px solid #ccc;
  border-radius: 4px;
}
// animation
// .card-move-enter-active,
// .card-move-leave-active {
//   transition: transform 10s, top 0.4s !important;
// }

.card-move-enter {
  transform: translateX(-600%) !important;
}
.card-move-leave-to {
  transform: translateX(600%) !important;
  z-index: 9 !important;
}
</style>
