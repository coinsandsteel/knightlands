<template>
  <div
    class="april-play-field width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <div
      class="april-play-stat flex flex-row flex-no-wrap flex-justify-center font-size-22 padding-top-2 padding-bottom-2 relative"
    >
      <div class="margin-right-2 font-weight-700">
        {{ $t("round") }} {{ level }}
      </div>
      <AprilGold
        class="april-gold--with-background padding-left-2"
        :value="balance ? balance.sessionGold : 0"
      />
      <CustomButton
        v-if="canSkipTurn"
        type="red"
        class="btn-skip-turn"
        @click="skipTurnHandler"
      >
        {{ $t("skip-turn") }}
      </CustomButton>
      <div class="close-btn" @click="stopHandler"></div>
    </div>

    <div
      class="april-play-board-container flex-full flex flex-center width-100 overflow-auto"
    >
      <div
        class="april-play-board-wrapper flex flex-row flex-no-wrap flex-justify-center width-100"
      >
        <div
          class="flex flex-column side-column side-column--left margin-right-1"
        >
          <!-- action points -->
          <TransitionGroup
            appear
            tag="div"
            name="fade"
            class="step-cells-wrapper flex flex-column"
          >
            <div
              v-for="(cell, cellIndex) in stepCells"
              :key="cellIndex"
              class="step-cell margin-top-1 margin-bottom-1"
            ></div>
          </TransitionGroup>
          <!-- purchase action point -->
          <div
            v-if="canPurchaseActionPoint && !hasBoughtActionPoints"
            class="step-cell step-cell-add margin-top-1 margin-bottom-1"
            @click="addActionPointHandler"
          ></div>
        </div>
        <!-- chess board -->
        <div class="april-play-board-border-outer">
          <div class="april-play-board-border relative">
            <div class="april-play-board-background absolute-stretch"></div>
            <div class="april-play-board">
              <AprilBoardCell
                v-for="(cell, cellIndex) in boardCells"
                :key="cellIndex"
                :index="cellIndex"
                @click="cellClickHandler(cell, cellIndex)"
              />
            </div>
          </div>
        </div>
        <!-- hp -->
        <div
          class="flex flex-column margin-top-1 margin-left-1 side-column side-column--right"
        >
          <AprilHp v-if="hpCells.length > 6" :value="hpCells.length" />
          <TransitionGroup
            v-else
            appear
            tag="div"
            name="fade"
            class="hp-cells-wrapper flex flex-column"
          >
            <div
              v-for="(cell, cellIndex) in hpCells"
              :key="cellIndex"
              class="hp-cell margin-bottom-1"
            ></div>
          </TransitionGroup>
          <div
            v-if="healing"
            class="hp-cell hp-cell--healing margin-bottom-1"
            :class="'hp-cell--healing-' + healing"
          />
        </div>
      </div>
    </div>

    <div class="april-play-decks flex flex-center width-100">
      <!-- deck1 -->
      <div class="april-play-deck-1 relative">
        <div
          class="april-play-deck-counter font-size-22 font-weight-700 absolute"
        >
          {{ cardsInQueue }}
        </div>
      </div>
      <!-- deck 2 -->
      <div class="april-play-deck-2">
        <TransitionGroup
          tag="div"
          name="card-move"
          class="april-cards-container relative"
        >
          <AprilCard
            v-for="(card, cardIndex) in currentCards"
            :key="card.hash"
            :card="card"
            :index="cardIndex"
            :totalCards="currentCards.length"
            @click="selectCard(card)"
          ></AprilCard>
        </TransitionGroup>
      </div>
      <!-- deck 3 -->
      <div class="april-play-deck-3 relative">
        <div
          class="april-play-deck-counter  font-size-22 font-weight-700 absolute"
        >
          {{ usedCards }}
        </div>
      </div>
    </div>

    <div v-if="false" class="width-100 flex flex-items-start">
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
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testPawnToQueen"
      >
        Pawn to Queen
      </CustomButton>
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testWin"
      >
        Win
      </CustomButton>
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testLose"
      >
        Lose
      </CustomButton>
      <CustomButton
        type="green"
        class="inline-block margin-right-2 margin-top-1"
        @click="testHealing"
      >
        Healing
      </CustomButton>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import random from "lodash/random";
import cloneDeep from "lodash/cloneDeep";
import { create } from "vue-modal-dialogs";
import { sleep } from "@/helpers/utils";
import * as april from "@/../../knightlands-shared/april";
import AprilGold from "@/views/April/AprilGold.vue";
import AprilStopGame from "@/views/April/AprilStopGame.vue";
import AprilCard from "@/views/April/AprilCard.vue";
import AprilHp from "@/views/April/AprilHp.vue";
import AprilBoardCell from "@/views/April/AprilBoardCell.vue";
import AprilPurchaseThirdActionPoint from "@/views/April/AprilPurchaseThirdActionPoint.vue";

export default {
  components: {
    AprilGold,
    AprilCard,
    AprilBoardCell,
    AprilHp
  },

  data() {
    return {
      // baseSize: 60
      count: 0,
      currentCards: [],
      hasBoughtActionPoints: false
    };
  },

  computed: {
    ...mapState(["appSize"]),
    ...mapState("april", [
      "balance",
      "actionPoints",
      "hp",
      "croupier",
      "selectedCardId",
      "level",
      "healing",
      "sessionResult",
      "isDisabled"
    ]),
    ...mapGetters("april", [
      "cards",
      "selectedCard",
      "damage",
      "units",
      "canPurchaseActionPoint"
    ]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 6)
        : Math.floor(375 / 6);
    },
    canSkipTurn() {
      return true;
    },
    boardCells() {
      return new Array(5 * 5).fill(null);
    },
    stepCells() {
      return new Array(this.actionPoints).fill(null);
    },
    hpCells() {
      return new Array(this.hp).fill(null);
    },
    cardsInQueue() {
      if (!this.croupier) {
        return 0;
      }

      if (Array.isArray(this.croupier.cardsInQueue)) {
        return this.croupier.cardsInQueue.length;
      }

      return this.croupier.cardsInQueue || 0;
    },
    usedCards() {
      if (!this.croupier) {
        return 0;
      }

      if (Array.isArray(this.croupier.usedCards)) {
        return this.croupier.usedCards.length;
      }

      return this.croupier.usedCards || 0;
    }
  },

  watch: {
    cards(value) {
      this.currentCards = [...value];
    },
    actionPoints(value, oldValue) {
      // console.log("actionPoints", value, oldValue, this.hasBoughtActionPoints);
      // if (this.hasBoughtActionPoints) {
      //   this.hasBoughtActionPoints = false;
      //   console.log("set actionPoints false");
      //   this.$store.commit("april/setCanPurchaseActionPoint", false);
      //   return;
      // }
      if (
        typeof oldValue === "number" &&
        value < oldValue &&
        this.hasBoughtActionPoints
      ) {
        this.hasBoughtActionPoints = false;
      }
      if (value >= 2 && typeof oldValue === "number" && value > oldValue) {
        this.$store.commit("april/setCanPurchaseActionPoint", true);
      }
    },
    sessionResult(value) {
      if (value === april.SESSION_RESULT_SUCCESS) {
        //
      } else if (value === april.SESSION_RESULT_SUCCESS) {
        //
      }
    }
  },

  mounted() {
    this.currentCards = [...this.cards];
  },

  methods: {
    async stopHandler() {
      const showDialog = create(AprilStopGame);
      const result = await showDialog();
      if (result) {
        this.$store.dispatch("april/exit");
        this.$emit("exit", true);
      }
    },
    testDrawCards() {
      const cards = [...this.currentCards];
      const num = cards.length <= 0 ? 4 : random(1, 2);
      const cardClasses = [
        april.CARD_CLASS_PAWN,
        april.CARD_CLASS_KNIGHT,
        april.CARD_CLASS_KING,
        april.CARD_CLASS_BISHOP,
        april.CARD_CLASS_ROOK,
        april.CARD_CLASS_QUEEN
      ];
      for (let i = 0; i < num; i++) {
        const card = {
          id: Date.now() + i,
          cardClass: cardClasses[random(0, cardClasses.length - 1)],
          nextCells: [...new Array(random(1, 3)).fill(null)].map(() =>
            random(0, 24)
          )
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
    async testUpdateCells() {
      const hp = this.hp;
      const actionPoints = this.actionPoints;
      this.$store.commit("april/updateState", {
        actionPoints: actionPoints - 1
      });
      await sleep(100);
      this.count++;
      const units1 = [
        { id: "wer2s929f", unitClass: april.UNIT_CLASS_TEETH, index: 6 },
        { id: "32vr45n7u6", unitClass: april.UNIT_CLASS_TEETH, index: 12 },
        { id: "89mnbv31x", unitClass: april.UNIT_CLASS_JACK, index: 13 },
        { id: "2n9v38534n", unitClass: april.UNIT_CLASS_HERO, index: 22 }
      ];
      const units2 = [
        { id: "89mnbv31x", unitClass: april.UNIT_CLASS_JACK, index: 13 },
        { id: "2n9v38534n", unitClass: april.UNIT_CLASS_HERO, index: 4 }
      ];
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
        damage: this.count % 2 ? damage2 : damage1,
        actionPoints,
        hp: hp > 6 ? 3 : 10
      });
    },

    testPawnToQueen() {
      const cards = cloneDeep(this.currentCards);
      const card = cards.find(
        ({ cardClass }) => cardClass === april.CARD_CLASS_PAWN
      );
      if (!card) {
        return;
      }

      card.cardClass = april.CARD_CLASS_QUEEN;
      this.$store.commit("april/updateState", { cards });
    },

    testWin() {
      this.$store.commit("april/updateState", {
        sessionResult: april.SESSION_RESULT_SUCCESS
      });
    },

    testLose() {
      this.$store.commit("april/updateState", {
        sessionResult: april.SESSION_RESULT_FAIL
      });
    },

    testHealing() {
      this.$store.commit("april/updateState", {
        healing: this.healing === 3 ? 0 : this.healing + 1
      });
    },

    selectCard(card) {
      if (this.isDisabled) {
        return;
      }

      if (!(this.hp > 0 && this.actionPoints > 0)) {
        this.$store.commit("april/setSelectedCardId", null);
        return;
      }

      this.$store.commit(
        "april/setSelectedCardId",
        card && this.selectedCardId === card.id ? null : card.id
      );
    },

    async addActionPointHandler() {
      const showDialog = create(AprilPurchaseThirdActionPoint);
      const result = await showDialog();
      if (result && result.hasBought) {
        this.hasBoughtActionPoints = true;
      }
    },

    skipTurnHandler() {
      this.$store.dispatch("april/skip");
      this.hasBoughtActionPoints = false;
    },

    cellClickHandler(cell, cellIndex) {
      if (!this.selectedCardId) {
        return;
      }
      this.$store.dispatch("april/move", {
        cardId: this.selectedCardId.toString(),
        index: cellIndex
      });
    }
  }
};
</script>

<style scoped lang="less">
.april-play-field {
  background: url("/images/april/background.jpg") center bottom / cover
    no-repeat;
}
.april-play-stat {
  background: #2f7285;
}
.close-btn {
  top: 50%;
  transform: translateY(-50%) scale(0.9);
}
.btn-skip-turn {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%) scale(0.9);
  margin: 0;
}
.april-play-decks {
  display: grid;
  grid-template-columns:
    calc(var(--base-size) / 2)
    1fr
    calc(var(--base-size) / 2);
  height: calc(1.2 * var(--base-size) + 3px + 40px);
  padding: 20px 0;
}
.april-play-deck-1,
.april-play-deck-3 {
  // background: url("/images/april/card_back.svg") center/70% repeat #3b3f65;
  // opacity: 0.5;
  // border-radius: 6px;
  // border: 1px solid #fff;
  height: 100%;
  z-index: 10;
  position: relative;
  transform: translateY(calc(-0.4 * var(--base-size)));
}
.april-play-deck-1 {
  // border-top-left-radius: 0px;
  // border-bottom-left-radius: 0px;
  // border-left: none;
  background: url(/images/april/chess_card_selected.png) center / 0,
    url("/images/april/chess_card.png") right / 200% 100% no-repeat;
}
.april-play-deck-2 {
  // overflow-x: hidden;
}
.april-play-deck-3 {
  // border-top-right-radius: 0px;
  // border-bottom-right-radius: 0px;
  // border-right: none;
  background: url("/images/april/chess_card.png") left / 200% 100% no-repeat;
}
.april-cards-container {
  height: calc(var(--base-size) * 1.2);
  // background: rgba(red, 30%);
}
.step-cell,
.hp-cell {
  width: calc(var(--base-size) * 0.3);
  height: calc(var(--base-size) * 0.3);
}
.step-cell {
  background: url("/images/april/action_point.png") center / 100% no-repeat;
}
.hp-cell {
  background: url("/images/april/hp.png") center / 100% no-repeat;
}
.hp-cell--healing-1 {
  background: url("/images/april/hp1.png") center / 100% no-repeat;
}
.hp-cell--healing-2 {
  background: url("/images/april/hp2.png") center / 100% no-repeat;
}
.hp-cell--healing-3 {
  background: url("/images/april/hp3.png") center / 100% no-repeat;
}
.april-hp {
  height: calc(var(--base-size) * 0.3);
  margin-top: -2px;
  ::v-deep .april-hp-icons {
    background-size: 95%;
  }
}
.step-cell-add {
  background: url("/images/april/action_point_add.png") center / 100% no-repeat;
}
.side-column {
  min-width: 40px;
}
.side-column--left {
  align-items: end;
}
.april-play-board {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--base-size) * 0.8));
}
.april-play-board-border-outer {
  // border: 1px solid #748da1;
  // border-radius: 4px;
}
.april-play-board-border {
  // border: 4px solid #748da1;
  // border-radius: 4px;
  padding: 4px;
}
.april-play-board-background {
  background: url("/images/april/board.png") center / 100% no-repeat;
}
.april-play-deck-counter {
  left: 60%;
  top: 0;
  transform: translate(-50%, -120%);
}
.april-play-deck-1 .april-play-deck-counter {
  left: 40%;
}
// animation
// .card-move-enter-active,
// .card-move-leave-active {
//   transition: transform 10s, top 0.4s !important;
// }

// animate
.card-move-enter {
  transform: translate(-600%, calc(-0.6 * var(--base-size))) !important;
}
.card-move-leave-to {
  transform: translate(600%, calc(-0.6 * var(--base-size))) !important;
  z-index: 9 !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
