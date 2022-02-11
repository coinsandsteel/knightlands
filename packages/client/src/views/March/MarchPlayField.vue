<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <div class="flex flex-row flex-no-wrap flex-justify-center font-size-22">
      <div class="padding-right-2">HP???: 8/8</div>
      <div class="padding-right-2 padding-left-2">Armor???: 4</div>
      <div class="padding-left-2">Extra life???: 1</div>
    </div>
    <div class="flex-full flex flex-center width-100">
      <div class="width-100 padding-left-6 padding-right-6">
        <div
          v-if="cards && cards.length > 0"
          class="march-cards-container"
          ref="marchCardsContainer"
        >
          <MarchCard
            v-for="card in cards"
            ref="cards"
            :key="card._id"
            :card="card"
            :class="{ 'opacity-50': !initialized }"
            @click="clickHandler(card)"
            @swipe="swipeHandler(card, $event)"
          />
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
import anime from "animejs/lib/anime.es.js";
import * as testData from "@/helpers/testData";
// import { sleep } from "@/helpers/utils";
import * as march from "@/../../knightlands-shared/march";
import explode from "@/helpers/explodeAnimation";
import MarchPlayMiniGame from "@/views/March/MarchPlayMiniGame.vue";
import MarchCard from "@/views/March/MarchCard.vue";

const commonAnimationParams = {
  duration: 200,
  easing: "linear",
  delay: anime.stagger(30)
};
const gapSize = 12;
const explodeColors = ["#aaa", "#ccc", "#eee"];

export default {
  components: {
    MarchCard
  },
  data() {
    return {
      initialized: false,
      petCurrentIndex: null,
      petMoveDirection: null
    };
  },
  computed: {
    ...mapGetters("march", ["cards"])
  },
  mounted() {
    // this.showMiniGame();
    this.init();
  },
  methods: {
    async nextTickPromise() {
      return new Promise(resolve => {
        this.$nextTick(() => {
          resolve();
        });
      });
    },
    async showMiniGame() {
      const showMiniGameDialog = create(MarchPlayMiniGame);
      const result = await showMiniGameDialog();
      console.log("result", result);
    },

    async init() {
      if (this.initialized) {
        return;
      }
      await this.animateShow(this.getCardElement());
      this.initialized = true;
    },

    getCardElement(index) {
      // if (typeof index !== "number") {
      //   return this.$refs.cards.map(({ $el }) => $el);
      // }
      // return this.$refs.cards.find(vm => vm.card.index === index).$el;
      const elements = this.$refs.marchCardsContainer.querySelectorAll(
        ".march-card"
      );
      if (typeof index !== "number") {
        return elements;
      }
      return elements[index];
    },

    swipeHandler(card, direction) {
      console.log("swipeHandler", direction);
      // this.testMove();
      const petCardIndex = this.cards.findIndex(({ isPet }) => isPet);
      const cardIndex =
        direction === "left"
          ? petCardIndex - 1
          : direction === "right"
          ? petCardIndex + 1
          : direction === "up"
          ? petCardIndex - 3
          : petCardIndex + 3;

      if (
        !(
          petCardIndex >= 0 &&
          petCardIndex <= 8 &&
          cardIndex >= 0 &&
          cardIndex <= 8
        )
      ) {
        return;
      }

      this.move(petCardIndex, cardIndex, direction);
    },
    clickHandler(card) {
      console.log("clickHandler");
      if (!card.canClick) {
        return;
      }

      const petCardIndex = this.cards.findIndex(({ isPet }) => isPet);
      const cardIndex = this.cards.findIndex(({ _id }) => _id === card._id);

      if (
        !(
          petCardIndex >= 0 &&
          petCardIndex <= 8 &&
          cardIndex >= 0 &&
          cardIndex <= 8
        )
      ) {
        return;
      }

      const direction =
        cardIndex === petCardIndex - 1
          ? "left"
          : cardIndex === petCardIndex + 1
          ? "right"
          : cardIndex < petCardIndex
          ? "up"
          : "down";
      this.move(petCardIndex, cardIndex, direction);
      // this.testMove();

      // this.animateShow(this.getCardElement(card.index), { resetStyle: true });
      // this.animateHide(this.getCardElement(card.index), { resetStyle: true });
      // this.animateMoveUp(this.getCardElement(card.index), {
      //   resetStyle: false
      // });
      // this.animateMoveDown(this.getCardElement(card.index), {
      //   resetStyle: false
      // });
      // this.animateMoveLeft(this.getCardElement(card.index), {
      //   resetStyle: false
      // });
      // this.animateMoveRight(this.getCardElement(card.index), {
      //   resetStyle: false
      // });
      // this.animateShake(this.getCardElement(card.index), {
      //   resetStyle: true
      // });
      // this.animateExplode(this.getCardElement(card.index));
    },

    async move(fromIndex, toIndex, direction) {
      console.log("move fromIndex", fromIndex);
      console.log("toIndex", toIndex);
      console.log("direction", direction);
      this.petCurrentIndex = fromIndex;
      this.petMoveDirection = direction;

      const response = await this.requestMove();
      await this.animateMove(response);
      // this.$store.commit("march/updateState", {
      //   cards: [...response[0].state]
      // });
    },

    async requestMove() {
      await this.nextTickPromise();
      return testData.c1.response;
    },

    async animateMove(response) {
      await this.animateMoveStage(response[0]);
      if (response.length > 1) {
        await this.animateMoveStage(response[1]);
      }
    },

    findElementsNotExist(arr1, arr2) {
      const ids2 = arr2.map(({ _id }) => _id);
      return arr1.filter(({ _id }) => !ids2.includes(_id));
    },

    findElementsExistButChangedPosition(arr1, arr2) {
      const ids1 = arr1.map(({ _id }) => _id);
      const ids2 = arr2.map(({ _id }) => _id);
      return arr1.filter(
        ({ _id }) =>
          ids2.includes(_id) && ids1.indexOf(_id) !== ids2.indexOf(_id)
      );
    },

    findCardIndex(id, arr) {
      return arr.findIndex(({ _id }) => _id === id);
    },

    async animateMoveStage(stage) {
      const updatedCards = stage.cards;
      const destroyedCards = this.findElementsNotExist(
        this.cards,
        updatedCards
      );
      console.log("destroyedCards", destroyedCards);

      const movedCards = this.findElementsExistButChangedPosition(
        this.cards,
        updatedCards
      );
      console.log("movedCards", movedCards);
      // const animationItems = [];
      // if (destroyedCards.length > 0) {
      //   destroyedCards.forEach((card) => {
      //     const cardIndex =
      //     animationItems.push(
      //       this.animateHide(this.getCardElement(), { resetStyle: true }),
      //     );
      //   });
      // }
      await Promise.all([
        Promise.all(
          destroyedCards.map(card => {
            return this.animateHide(
              this.getCardElement(this.findCardIndex(card._id, this.cards)),
              { resetStyle: false }
            );
          })
        ),
        Promise.all(
          movedCards.map(card => {
            const index = this.findCardIndex(card._id, this.cards);
            const newIndex = this.findCardIndex(card._id, updatedCards);

            if (newIndex === index - 1) {
              return this.animateMoveLeft(this.getCardElement(index), {
                resetStyle: false
              });
            } else if (newIndex === index + 1) {
              return this.animateMoveRight(this.getCardElement(index), {
                resetStyle: false
              });
            } else if (newIndex < index) {
              return this.animateMoveUp(this.getCardElement(index), {
                resetStyle: false
              });
            } else if (newIndex > index) {
              return this.animateMoveRight(this.getCardElement(index), {
                resetStyle: false
              });
            }
          })
        )
      ]);

      const newCards = this.findElementsNotExist(updatedCards, this.cards);
      console.log("newCards", newCards);

      this.$store.commit("march/updateState", { cards: updatedCards });
      await this.nextTickPromise();
      const elements = this.getCardElement();
      this.resetStyle(elements, true);

      await Promise.all(
        newCards.map(card => {
          const index = this.findCardIndex(card._id, updatedCards);
          this.animateShow(this.getCardElement(index), { resetStyle: true });
          return;
        })
      );
    },

    async testMove() {
      if (this.cards[4].isPet) {
        await Promise.all([
          this.animateHide(this.getCardElement(1), { resetStyle: true }),
          this.animateMoveUp(this.getCardElement(4), { resetStyle: true }),
          this.animateMoveUp(this.getCardElement(7), { resetStyle: true })
        ]);
        const cards = [...this.$store.state.march.cards];
        cards[1] = cards[4];
        cards[4] = cards[7];
        cards[7] = {
          _id: new Date().getTime().toString(),
          unitClass: march.UNIT_CLASS_ENEMY,
          hp: 4
        };
        this.$store.commit("march/updateState", { cards });
        // await sleep(0);
        await this.nextTickPromise();
        this.animateShow(this.getCardElement(7), { resetStyle: true });

        return;
      }
      if (this.cards[1].isPet) {
        await Promise.all([
          this.animateHide(this.getCardElement(0), { resetStyle: true }),
          this.animateMoveLeft(this.getCardElement(1), { resetStyle: true }),
          this.animateMoveLeft(this.getCardElement(2), { resetStyle: true })
        ]);
        const cards = [...this.$store.state.march.cards];
        cards[0] = cards[1];
        cards[1] = cards[2];
        cards[2] = {
          _id: new Date().getTime().toString(),
          unitClass: march.UNIT_CLASS_GOLD,
          hp: 4
        };
        this.$store.commit("march/updateState", { cards });
        await this.nextTickPromise();
        this.animateShow(this.getCardElement(2), { resetStyle: true });
        return;
      }
      if (this.cards[0].isPet) {
        await Promise.all([
          this.animateHide(this.getCardElement(3), { resetStyle: true }),
          this.animateMoveDown(this.getCardElement(0), { resetStyle: true }),
          this.animateMoveLeft(this.getCardElement(1), { resetStyle: true }),
          this.animateMoveLeft(this.getCardElement(2), { resetStyle: true })
        ]);
        const cards = [...this.$store.state.march.cards];
        cards[3] = cards[0];
        cards[0] = cards[1];
        cards[1] = cards[2];
        cards[2] = {
          _id: new Date().getTime().toString(),
          unitClass: march.UNIT_CLASS_TRAP,
          hp: 4
        };
        this.$store.commit("march/updateState", { cards });
        await this.nextTickPromise();
        this.animateShow(this.getCardElement(2), { resetStyle: true });
        return;
      }
      if (this.cards[3].isPet) {
        await Promise.all([
          this.animateHide(this.getCardElement(4), { resetStyle: true }),
          this.animateMoveRight(this.getCardElement(3), { resetStyle: true }),
          this.animateMoveUp(this.getCardElement(6), { resetStyle: true })
        ]);
        const cards = [...this.$store.state.march.cards];
        cards[4] = cards[3];
        cards[3] = cards[6];
        cards[6] = {
          _id: new Date().getTime().toString(),
          unitClass: march.UNIT_CLASS_CHEST,
          hp: 4
        };
        this.$store.commit("march/updateState", { cards });
        await this.nextTickPromise();
        this.animateShow(this.getCardElement(6), { resetStyle: true });
        return;
      }
    },

    resetStyle(el, resetStyle) {
      if (!resetStyle) {
        return;
      }

      if (el && typeof el.length === "number") {
        el.forEach(item => item.removeAttribute("style"));
      } else {
        el.removeAttribute("style");
      }
    },

    async animateShow(el, { resetStyle } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        opacity: [0, 1],
        scale: [0, 1]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateHide(el, { resetStyle } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        opacity: [1, 0],
        scale: [1, 0]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateMoveUp(el, { resetStyle } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        translateY: [0, `calc(-100% - ${gapSize}px)`]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateMoveDown(el, { resetStyle } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        translateY: [0, `calc(100% + ${gapSize}px)`]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateMoveLeft(el, { resetStyle } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        translateX: [0, `calc(-100% - ${gapSize}px)`]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateMoveRight(el, { resetStyle } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        translateX: [0, `calc(100% + ${gapSize}px)`]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateShake(el, { resetStyle } = {}) {
      const animation = anime({
        targets: el,
        duration: 50,
        loop: 2,
        direction: "alternate",
        easing: "easeOutBack",
        translateX: ["-.5rem", ".5rem"],
        translateY: [".25rem", "-.25rem"]
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    animateExplode(el) {
      const bound = el.getBoundingClientRect();

      explode(
        Math.round(bound.left + bound.width / 2),
        Math.round(bound.top + bound.height / 2),
        Math.round(bound.width / 1.5),
        70,
        explodeColors
      );
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
.march-card--pet {
  background: rgba(green, 0.2);
}
.march-card--adjacent {
  background: rgba(blue, 0.2);
}
</style>
