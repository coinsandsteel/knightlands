<template>
  <div class="cards-container flex" @click="handleContinue">
    <!-- <span
      class="cards-title center-transform rarity-legendary font-outline"
      :class="{show: choice}"
    >{{$t("trial-choose-cards-title")}}</span> -->

    <div class="flex flex-center flex-space-evenly width-100 height-100 flex-self-end">
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :effect="card"
        :fightMeta="fightMeta"
        ref="cards"
        class="flex-basis-40"
        @click="handleCardChoice(index)"
      ></Card>
    </div>

    <span
      class="cards-footer center-transform rarity-common font-outline"
      :class="{show: showContinue}"
    >{{$t("tap-to-continue")}}</span>
  </div>
</template>

<script>
const RowCount = 2; // how many cards per row?

import Card from "./Card.vue";
import anime from "animejs/lib/anime.es.js";

export default {
  props: ["trialType", "cards", "fightMeta"],
  components: { Card },
  data: () => ({
    showContinue: false,
    choice: false,
    chosenCard: -1
  }),
  watch: {
    cards: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          anime.set(this.$el, { opacity: 1 });
          this.chosenCard = -1;
          this.showSequence();
        });
      }
    }
  },
  methods: {
    async handleContinue() {
      if (!this.showContinue) {
        return;
      }

      this.showContinue = false;

      if (this.chosenCard != -1) {
        this.choice = false;

        const timeline = anime.timeline({
          duration: 500
        });

        timeline
          .add({
            targets: this.$refs.cards[this.chosenCard].$el,
            translateY: -this.$el.offsetHeight,
            easing: "easeInOutBack"
          })
          .add(
            {
              targets: this.$el,
              opacity: 0
            },
            500
          );

        await timeline.finished;

        this.chosenCard = -1;

        this.$emit("cardEffect", this.cardEffectData);
      } else {
        await this._createShowSequence(true).finished;

        this.$refs.cards.forEach(card => {
          card.setFlipped(false, false);
        });

        await this._createShowSequence().finished;

        this.choice = true;
      }
    },
    async showSequence() {
      if (!this.cards) {
        return;
      }

      this.$refs.cards.forEach(card => {
        card.setFlipped(false, false);
      });

      // show cards
      await this._createShowSequence().finished;

      this.choice = true;
    },
    _createShowSequence(reversed) {
      let elWdith = 0;
      const targets = [];

      this.$refs.cards.forEach(card => {
        targets.push(card.$el);
        elWdith = card.$el.offsetWidth;
      });

      const thisHeight = this.$el.offsetHeight;
      const thisWidth = this.$el.offsetWidth;

      const mainDuration = 500;
      const startScale = 0.4;
      // move outside of view port

      let timeline = anime({
        targets: targets,
        translateY: [
          {
            duration: 0,
            value: thisHeight
          },
          {
            duration: mainDuration,
            value: 0,
            delay: anime.stagger(250),
            easing: "easeOutSine"
          }
        ],
        translateX: [
          {
            duration: 0,
            value: anime.stagger([
              thisWidth / 2 - elWdith / 2,
              -thisWidth / 2 + elWdith / 2
            ])
          },
          {
            duration: mainDuration,
            value: 0,
            delay: anime.stagger(250),
            easing: "easeOutSine"
          }
        ],
        rotate: [
          {
            duration: 0,
            value: anime.stagger([-45, 45])
          },
          {
            duration: 700,
            value: 0,
            delay: anime.stagger(250),
            easing: "easeOutCubic"
          }
        ],
        scale: [
          {
            duration: 0,
            value: startScale
          },
          {
            duration: mainDuration,
            value: 1,
            delay: anime.stagger(250),
            easing: "linear"
          }
        ]
      });

      if (reversed) {
        timeline.seek(mainDuration);
        timeline.reverse();
      }

      return timeline;
    },
    async handleCardChoice(cardIndex) {
      if (!this.choice || this.chosenCard != -1) {
        return;
      }

      this.chosenCard = cardIndex;
      this.cardEffectData = await this.$game.chooseTrialCard(
        this.trialType,
        cardIndex
      );

      // set chosen card effect type
      const card = this.$refs.cards[cardIndex];
      card.overriddenEffect = this.cardEffectData.effect;
      const cardPosition = card.$el.getBoundingClientRect();
      const duration = 600;

      // hide rest of the cards
      const hideTargets = this.$refs.cards
        .filter((value, index) => index != cardIndex)
        .map(x => x.$el);

      anime({
        targets: hideTargets,
        rotate: () => {
          return anime.random(-360, 360);
        },
        translateY: this.$el.offsetHeight,
        translateX: this.$el.offsetWidth,
        duration: 4000
      });

      card.elevate();

      await anime({
        targets: card.$el,
        translateX:
          this.$el.offsetWidth / 2 -
          cardPosition.left -
          card.$el.offsetWidth / 2,
        translateY:
          this.$el.offsetHeight / 2 -
          cardPosition.top -
          card.$el.offsetHeight / 2,
        scale: [{ value: 1.5, duration, easing: "easeOutCubic" }],
        duration: duration
      }).finished;

      await card.choiceAnimation();

      this.showContinue = true;
    }
  }
};
</script>

<style lang="less" scoped>
.cards-text() {
  position: absolute;
  width: 100%;
  opacity: 0;
  transition: all 0.2s ease;

  &.show {
    opacity: 1;
  }
}

.cards-container {
  pointer-events: all;
  z-index: 9999;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000000ba;
  position: absolute;
  overflow: hidden;

  & .cards-title {
    font-size: 6rem;
    top: 10%;
    .cards-text();
  }

  & .cards-footer {
    font-size: 4rem;
    bottom: 20vh;
    .cards-text();
  }
}
</style>