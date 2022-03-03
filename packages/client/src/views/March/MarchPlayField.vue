<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <div
      class="march-play-stat flex flex-row flex-no-wrap flex-justify-center font-size-22 padding-top-4 padding-bottom-4 relative"
    >
      <MarchMaxHp
        class="march-max-hp march-max-hp--with-background padding-left-2 margin-right-2"
        :value="petCard ? petCard.maxHp : 0"
      />
      <MarchStep
        class="march-step--with-background padding-left-2 margin-right-2"
        :value="stat ? stat.stepsToNextBoss : 0"
      />
      <MarchBosses
        class="march-bosses--with-background padding-left-2 margin-right-2 margin-left-2"
        :value="stat ? stat.bossesKilled : 0"
      />
      <MarchGold
        class="march-gold--with-background padding-left-2 margin-left-2"
        :value="balance ? balance.sessionGold : 0"
      />

      <div class="close-btn" @click="stopHandler"></div>
    </div>
    <div class="march-play-cards flex-full flex flex-center width-100">
      <div class="width-100 padding-left-6 padding-right-6">
        <div class="march-cards-container" ref="marchCardsContainer">
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
    <!-- <div class="padding-top-5 padding-bottom-5">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="testShowMiniGame"
      >
        Mini game
      </CustomButton>
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="$emit('next')"
      >
        Finish
      </CustomButton>
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="testNextHp"
      >
        MaxHp
      </CustomButton>
    </div> -->
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import { create } from "vue-modal-dialogs";
import anime from "animejs/lib/anime.es.js";
import { sleep } from "@/helpers/utils";
import * as march from "@/../../knightlands-shared/march";
import explode from "@/helpers/explodeAnimation";
import lightningAnimation from "@/helpers/lightningAnimation";
import MarchPlayMiniGame from "@/views/March/MarchPlayMiniGame.vue";
import MarchCard from "@/views/March/MarchCard.vue";
import MarchMaxHp from "@/views/March/MarchMaxHp.vue";
import MarchStep from "@/views/March/MarchStep.vue";
import MarchBosses from "@/views/March/MarchBosses.vue";
import MarchGold from "@/views/March/MarchGold.vue";
import MarchStopGame from "@/views/March/MarchStopGame.vue";

const commonAnimationParams = {
  duration: 200,
  easing: "linear",
  delay: anime.stagger(30)
};
const gapSize = 12;
const explodeColors = ["#aaa", "#ccc", "#eee"];

export default {
  components: {
    MarchCard,
    MarchMaxHp,
    MarchStep,
    MarchBosses,
    MarchGold
  },
  data() {
    return {
      initialized: false,
      processing: false,
      petCurrentIndex: null,
      petMoveDirection: null,
      currentStage: 0,
      isTargetABarrel: false
    };
  },
  computed: {
    ...mapGetters("march", ["cards", "petCard"]),
    ...mapState("march", [
      "sequence",
      "pet",
      "boosters",
      "stat",
      "balance",
      "miniGameReady",
      "miniGameResult"
    ]),
    petCard() {
      if (!(this.cards && this.cards.length > 0)) {
        return;
      }
      return this.cards.find(card => card.isPet);
    }
  },
  watch: {
    "petCard.hp": function(value) {
      if (value <= 0) {
        this.$emit("next");
      }
    },
    async sequence(value) {
      if (value) {
        await this.animateMove(value);
      }
    },
    miniGameReady(value) {
      if (value && value.isReady) {
        this.showMiniGame();
      }
    },
    miniGameResult(value, oldValue) {}
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
    async testShowMiniGame() {
      this.$store.commit("march/updateState", {
        miniGameReady: { isReady: true }
      });
    },
    async showMiniGame() {
      this.$store.commit("march/updateState", {
        miniGameResult: { isSuccess: false }
      });
      const showMiniGameDialog = create(MarchPlayMiniGame);
      await showMiniGameDialog();
    },

    async init() {
      if (this.initialized) {
        return;
      }
      await this.animateShow(this.getCardElement(), { resetStyle: true });
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
      if (this.processing || !this.initialized) {
        return;
      }
      this.processing = true;
      this.petCurrentIndex = fromIndex;
      this.petMoveDirection = direction;
      this.isTargetABarrel =
        this.cards[toIndex].unitClass === march.UNIT_CLASS_BARREL;

      await this.$store.dispatch("march/touchCard", toIndex);
    },

    async animateMove(response) {
      for (let i = 0; i < response.length; i++) {
        this.currentStage = i;
        await this.animateMoveStage(response[i]);
        await this.nextTickPromise();
        await sleep(100);
      }
      this.processing = false;
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

    processStageCards(stageCards) {
      const cards = [...this.$store.state.march.cards];
      const updatedCards = [...stageCards];
      for (let i = 0; i < updatedCards.length; i++) {
        const updatedCard = updatedCards[i];
        if (updatedCard && updatedCard._id) {
          const card = cards.find(({ _id }) => _id === updatedCard._id);
          updatedCards[i] = { ...(card || {}), ...updatedCard };
          // animate hp, max hp after kill boss
          if (typeof updatedCards[i].previousHp === "number") {
            updatedCards[i].hp = updatedCards[i].previousHp;
            delete updatedCards[i].previousHp;
            delete updatedCards[i].maxHp;
          }
        } else {
          updatedCards[i] = { ...cards[i] };
          delete updatedCards[i].previousHp;
        }
      }
      return updatedCards;
    },

    async animateMoveStage(stage) {
      const stageCards = this.processStageCards(cloneDeep(stage.cards));
      const cards = [...this.cards];
      const updatedCards = [...stageCards];
      const destroyedCards = this.findElementsNotExist(cards, updatedCards);

      const movedCards = this.findElementsExistButChangedPosition(
        cards,
        updatedCards
      );

      await Promise.all([
        // hide destroyed cards
        Promise.all(
          destroyedCards.map(async card => {
            const cardElement = this.getCardElement(
              this.findCardIndex(card._id, cards)
            );
            if (
              this.currentStage === 0 &&
              this.isTargetABarrel &&
              card.unitClass === march.UNIT_CLASS_BARREL
            ) {
              this.animateExplode(cardElement);
              await this.animateShake(cardElement);
            }
            await this.animateHide(cardElement);
          })
        ),
        // move position updated cards
        Promise.all(
          movedCards.map(card => {
            const index = this.findCardIndex(card._id, cards);
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
              return this.animateMoveDown(this.getCardElement(index), {
                resetStyle: false
              });
            }
          })
        )
      ]);

      const newCards = this.findElementsNotExist(updatedCards, cards);

      this.$store.commit("march/updateState", {
        cards: updatedCards,
        shouldIgnoreProcess: true
      });
      await this.nextTickPromise();
      const elements = this.getCardElement();
      this.resetStyle(elements, true);

      // show new cards
      await Promise.all(
        newCards.map(card => {
          const index = this.findCardIndex(card._id, updatedCards);
          this.animateShow(this.getCardElement(index), { resetStyle: true });
          return;
        })
      );

      // apply effect
      if (stage.effect) {
        const effect = stage.effect;
        if (effect.unitClass === march.UNIT_CLASS_BOW) {
          await this.animateBowEffect(effect);
        } else if (effect.unitClass === march.UNIT_CLASS_BOMB) {
          await this.animateBombEffect(effect);
        } else if (effect.unitClass === march.UNIT_CLASS_BALL_LIGHTNING) {
          await this.animateBallLightningEffect(effect);
        } else if (effect.unitClass === march.UNIT_CLASS_DRAGON_BREATH) {
          await this.animateDragonBreathEffect(effect);
        }
      }

      // apply pet hp animation after kill boss
      const previousHpCard = stage.cards.find(
        card => card && typeof card.previousHp === "number"
      );
      if (previousHpCard) {
        const updatedHpCards = cloneDeep(this.cards);
        const petCards = updatedHpCards.find(({ isPet }) => isPet);
        petCards.hp = previousHpCard.hp;
        if (typeof previousHpCard.maxHp === "number") {
          petCards.maxHp = previousHpCard.maxHp;
        }
        // await this.animateMaxHp();
        await this.animateHp();
        this.$store.commit("march/updateState", {
          cards: updatedHpCards,
          shouldIgnoreProcess: true
        });
      }
    },

    testNextHp() {
      const cards = cloneDeep(this.cards);
      const cardPet = cards.find(({ isPet }) => isPet);
      cardPet.previousHp = 777;
      cardPet.hp = 999;
      cardPet.maxHp = 222;
      this.animateMove([{ cards }]);
    },

    // async testMove() {
    //   if (this.cards[4].isPet) {
    //     await Promise.all([
    //       this.animateHide(this.getCardElement(1), { resetStyle: true }),
    //       this.animateMoveUp(this.getCardElement(4), { resetStyle: true }),
    //       this.animateMoveUp(this.getCardElement(7), { resetStyle: true })
    //     ]);
    //     const cards = [...this.$store.state.march.cards];
    //     cards[1] = cards[4];
    //     cards[4] = cards[7];
    //     cards[7] = {
    //       _id: new Date().getTime().toString(),
    //       unitClass: march.UNIT_CLASS_ENEMY,
    //       hp: 4
    //     };
    //     this.$store.commit("march/updateState", { cards });
    //     // await sleep(0);
    //     await this.nextTickPromise();
    //     this.animateShow(this.getCardElement(7), { resetStyle: true });

    //     return;
    //   }
    //   if (this.cards[1].isPet) {
    //     await Promise.all([
    //       this.animateHide(this.getCardElement(0), { resetStyle: true }),
    //       this.animateMoveLeft(this.getCardElement(1), { resetStyle: true }),
    //       this.animateMoveLeft(this.getCardElement(2), { resetStyle: true })
    //     ]);
    //     const cards = [...this.$store.state.march.cards];
    //     cards[0] = cards[1];
    //     cards[1] = cards[2];
    //     cards[2] = {
    //       _id: new Date().getTime().toString(),
    //       unitClass: march.UNIT_CLASS_GOLD,
    //       hp: 4
    //     };
    //     this.$store.commit("march/updateState", { cards });
    //     await this.nextTickPromise();
    //     this.animateShow(this.getCardElement(2), { resetStyle: true });
    //     return;
    //   }
    //   if (this.cards[0].isPet) {
    //     await Promise.all([
    //       this.animateHide(this.getCardElement(3), { resetStyle: true }),
    //       this.animateMoveDown(this.getCardElement(0), { resetStyle: true }),
    //       this.animateMoveLeft(this.getCardElement(1), { resetStyle: true }),
    //       this.animateMoveLeft(this.getCardElement(2), { resetStyle: true })
    //     ]);
    //     const cards = [...this.$store.state.march.cards];
    //     cards[3] = cards[0];
    //     cards[0] = cards[1];
    //     cards[1] = cards[2];
    //     cards[2] = {
    //       _id: new Date().getTime().toString(),
    //       unitClass: march.UNIT_CLASS_TRAP,
    //       hp: 4
    //     };
    //     this.$store.commit("march/updateState", { cards });
    //     await this.nextTickPromise();
    //     this.animateShow(this.getCardElement(2), { resetStyle: true });
    //     return;
    //   }
    //   if (this.cards[3].isPet) {
    //     await Promise.all([
    //       this.animateHide(this.getCardElement(4), { resetStyle: true }),
    //       this.animateMoveRight(this.getCardElement(3), { resetStyle: true }),
    //       this.animateMoveUp(this.getCardElement(6), { resetStyle: true })
    //     ]);
    //     const cards = [...this.$store.state.march.cards];
    //     cards[4] = cards[3];
    //     cards[3] = cards[6];
    //     cards[6] = {
    //       _id: new Date().getTime().toString(),
    //       unitClass: march.UNIT_CLASS_CHEST,
    //       hp: 4
    //     };
    //     this.$store.commit("march/updateState", { cards });
    //     await this.nextTickPromise();
    //     this.animateShow(this.getCardElement(6), { resetStyle: true });
    //     return;
    //   }
    // },

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

    async animateShow(el, { resetStyle, params } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        opacity: [0, 1],
        scale: [0, 1],
        ...(params || {})
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateHide(el, { resetStyle, params } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        targets: el,
        opacity: [1, 0],
        scale: [1, 0],
        ...(params || {})
      });

      await animation.finished;
      this.resetStyle(el, resetStyle);
    },

    async animateFade(el, { resetStyle, params } = {}) {
      const animation = anime({
        ...commonAnimationParams,
        // duration: Math.floor(commonAnimationParams.duration / 3),
        targets: el,
        opacity: [0, 1],
        ...(params || {})
      });

      await animation.finished;

      // await sleep(100);

      const animation2 = anime({
        ...commonAnimationParams,
        // duration: Math.floor(commonAnimationParams.duration / 3),
        targets: el,
        opacity: [1, 0],
        ...(params || {})
      });

      await animation2.finished;
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
        loop: 6,
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
    },

    async animateLightning(el) {
      const bound = el.getBoundingClientRect();

      const stop = lightningAnimation(
        Math.round(bound.left),
        Math.round(bound.top),
        Math.round(bound.width)
      );

      await sleep(commonAnimationParams.duration);
      stop();
    },

    async animateBowEffect(effect) {
      const el = this.getCardElement(effect.index);
      if (!el) {
        return;
      }
      const effectElement = el.querySelector(".march-card-effects");

      if (effect.target && effect.target.length > 0) {
        let arrowTopElement = null;
        let arrowBottomElement = null;
        let arrowLeftElement = null;
        let arrowRightElement = null;

        for (let i = 0; i < effect.target.length; i++) {
          const index = effect.target[i];
          if (index === effect.index - 1) {
            // left arrow
            arrowLeftElement = document.createElement("div");
            arrowLeftElement.className =
              "march-arrow-effect march-arrow-effect--left absolute-stretch flex flex-center";
            effectElement.appendChild(arrowLeftElement);
          } else if (index === effect.index + 1) {
            // right arrow
            arrowRightElement = document.createElement("div");
            arrowRightElement.className =
              "march-arrow-effect march-arrow-effect--right absolute-stretch flex flex-center";
            effectElement.appendChild(arrowRightElement);
          } else if (index < effect.index) {
            // top arrow
            arrowTopElement = document.createElement("div");
            arrowTopElement.className =
              "march-arrow-effect march-arrow-effect--top absolute-stretch flex flex-center";
            effectElement.appendChild(arrowTopElement);
          } else if (index > effect.index) {
            // bottom arrow
            arrowBottomElement = document.createElement("div");
            arrowBottomElement.className =
              "march-arrow-effect march-arrow-effect--bottom absolute-stretch flex flex-center";
            effectElement.appendChild(arrowBottomElement);
          }
        }

        // animate arrow
        await Promise.all([
          arrowTopElement
            ? Promise.all([
                this.animateMoveUp(arrowTopElement),
                this.animateFade(arrowTopElement)
              ])
            : Promise.resolve(),
          arrowBottomElement
            ? Promise.all([
                this.animateMoveDown(arrowBottomElement),
                this.animateFade(arrowBottomElement)
              ])
            : Promise.resolve(),
          arrowLeftElement
            ? Promise.all([
                this.animateMoveLeft(arrowLeftElement),
                this.animateFade(arrowLeftElement)
              ])
            : Promise.resolve(),
          arrowRightElement
            ? Promise.all([
                this.animateMoveRight(arrowRightElement),
                this.animateFade(arrowRightElement)
              ])
            : Promise.resolve()
        ]);

        // explode no await
        Promise.all(
          effect.target.map(target => {
            return this.animateExplode(this.getCardElement(target));
          })
        );
        // shake
        await Promise.all(
          effect.target.map(target => {
            return this.animateShake(this.getCardElement(target));
          })
        );
      }

      effectElement.innerHTML = "";
    },

    async animateBombEffect(effect) {
      const el = this.getCardElement(effect.index);
      if (!el) {
        return;
      }
      const effectElement = el.querySelector(".march-card-effects");

      if (effect.target && effect.target.length > 0) {
        let bombTopElement = null;
        let bombBottomElement = null;
        let bombLeftElement = null;
        let bombRightElement = null;

        for (let i = 0; i < effect.target.length; i++) {
          const index = effect.target[i];
          if (index === effect.index - 1) {
            // left bomb
            bombLeftElement = document.createElement("div");
            bombLeftElement.className =
              "march-bomb-effect march-bomb-effect--left absolute-stretch flex flex-center";
            effectElement.appendChild(bombLeftElement);
          } else if (index === effect.index + 1) {
            // right bomb
            bombRightElement = document.createElement("div");
            bombRightElement.className =
              "march-bomb-effect march-bomb-effect--right absolute-stretch flex flex-center";
            effectElement.appendChild(bombRightElement);
          } else if (index < effect.index) {
            // top bomb
            bombTopElement = document.createElement("div");
            bombTopElement.className =
              "march-bomb-effect march-bomb-effect--top absolute-stretch flex flex-center";
            effectElement.appendChild(bombTopElement);
          } else if (index > effect.index) {
            // bottom bomb
            bombBottomElement = document.createElement("div");
            bombBottomElement.className =
              "march-bomb-effect march-bomb-effect--bottom absolute-stretch flex flex-center";
            effectElement.appendChild(bombBottomElement);
          }
        }

        // animate bomb
        // await Promise.all([
        //   bombTopElement
        //     ? Promise.all([
        //         this.animateMoveUp(bombTopElement),
        //         this.animateFade(bombTopElement)
        //       ])
        //     : Promise.resolve(),
        //   bombBottomElement
        //     ? Promise.all([
        //         this.animateMoveDown(bombBottomElement),
        //         this.animateFade(bombBottomElement)
        //       ])
        //     : Promise.resolve(),
        //   bombLeftElement
        //     ? Promise.all([
        //         this.animateMoveLeft(bombLeftElement),
        //         this.animateFade(bombLeftElement)
        //       ])
        //     : Promise.resolve(),
        //   bombRightElement
        //     ? Promise.all([
        //         this.animateMoveRight(bombRightElement),
        //         this.animateFade(bombRightElement)
        //       ])
        //     : Promise.resolve()
        // ]);

        // explode no await
        Promise.all([
          this.animateExplode(this.getCardElement(effect.index)),
          effect.target.map(target => {
            return this.animateExplode(this.getCardElement(target));
          })
        ]);
        // shake
        await Promise.all([
          this.animateExplode(this.getCardElement(effect.index)),
          effect.target.map(target => {
            return this.animateShake(this.getCardElement(target));
          })
        ]);
      }

      // effectElement.innerHTML = "";
    },

    async animateBallLightningEffect(effect) {
      // explode no await
      Promise.all(
        effect.target.map(target => {
          return this.animateLightning(this.getCardElement(target));
        })
      );
      // shake
      await Promise.all(
        effect.target.map(target => {
          return this.animateShake(this.getCardElement(target));
        })
      );
    },

    async animateDragonBreathEffect(effect) {
      // explode no await
      Promise.all(
        effect.target.map(target => {
          return this.animateExplode(this.getCardElement(target));
        })
      );
      // shake
      await Promise.all(
        effect.target.map(target => {
          return this.animateShake(this.getCardElement(target));
        })
      );
    },

    async animateMaxHp() {
      const index = this.cards.findIndex(({ isPet }) => isPet);
      const petElement = this.getCardElement(index);
      const petHpElement = petElement.querySelector(".march-card-hp");
      const maxHpElement = document.querySelector(".march-max-hp");
      const plusOneElement = document.createElement("div");
      plusOneElement.className = "absolute font-size-25 text-white";
      plusOneElement.textContent = "+1";
      petHpElement.appendChild(plusOneElement);
      const bound = plusOneElement.getBoundingClientRect();
      const bound1 = maxHpElement.getBoundingClientRect();
      const x = bound.x - bound1.x - 30;
      const y = bound.y - bound1.y - 10;

      const animation = anime({
        // ...commonAnimationParams,
        duration: commonAnimationParams.duration * 2,
        easing: "easeOutQuad",
        targets: plusOneElement,
        fontSize: [0, 60],
        translateX: [0, -x / 2],
        translateY: [0, -y / 2]
      });
      await animation.finished;

      const animation2 = anime({
        // ...commonAnimationParams,
        duration: commonAnimationParams.duration * 2,
        easing: "easeInQuad",
        targets: plusOneElement,
        fontSize: [60, 0],
        translateX: -x,
        translateY: -y
      });

      await animation2.finished;
      plusOneElement.parentElement.removeChild(plusOneElement);
    },

    async animateHp() {
      const index = this.cards.findIndex(({ isPet }) => isPet);
      const petElement = this.getCardElement(index);
      const petHpElement = petElement.querySelector(".march-card-hp");
      const plusOneElement = document.createElement("div");
      plusOneElement.className = "absolute font-size-25 text-white";
      plusOneElement.textContent = "+1";
      petHpElement.appendChild(plusOneElement);

      const animation = anime({
        // ...commonAnimationParams,
        duration: commonAnimationParams.duration * 1.5,
        easing: "easeOutQuad",
        targets: plusOneElement,
        fontSize: [0, 60],
        translateY: [0, -50]
      });
      await animation.finished;

      const animation2 = anime({
        // ...commonAnimationParams,
        duration: commonAnimationParams.duration * 1.5,
        easing: "easeInQuad",
        targets: plusOneElement,
        fontSize: [60, 0],
        translateY: 0
      });

      await animation2.finished;
      plusOneElement.parentElement.removeChild(plusOneElement);
    },

    async stopHandler() {
      const showDialog = create(MarchStopGame);
      const result = await showDialog();
      if (result) {
        this.$store.dispatch("march/exitGame");
        this.$emit("next", true);
      }
    }
  }
};
</script>
<style scoped lang="less">
.march-play-stat {
  background: #2f7285;
}
.march-play-cards {
  background-image: url("/images/march/game_background.jpg");
  background-size: cover;
  background-position: bottom;
}
.march-cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}
.march-card--pet {
  // background: rgba(green, 0.2);
}
.march-card--adjacent {
  // background: rgba(blue, 0.2);
}
.close-btn {
  top: 50%;
  transform: translateY(-50%) scale(0.9);
}
</style>
