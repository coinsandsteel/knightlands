<template>
  <div
    class="april-card-container absolute"
    :style="{
      top: isSelected ? 'calc(-0.4 * var(--base-size))' : 0,
      transform: `translate(${translateX}, 0)`,
      zIndex: index + 1
    }"
    @click="$emit('click', card)"
  >
    <div class="april-card-wrapper">
      <div
        class="april-card relative"
        :class="[
          `april-card--${card.cardClass}`,
          { 'april-card--selected': isSelected }
        ]"
      >
        <div
          class="april-card-background absolute-stretch"
          :class="`april-card-background--${card.cardClass}`"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    card: Object,
    index: Number,
    totalCards: Number
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("april", ["selectedCard"]),
    isSelected() {
      return (
        this.card && this.selectedCard && this.card.id === this.selectedCard.id
      );
    },
    indexFromCenter2() {
      return this.index + 0.5 - this.totalCards / 2;
    },
    indexFromCenter() {
      const index = Math.ceil(this.index - this.totalCards / 2);
      if (this.totalCards % 2) {
        return index;
      } else {
        return index >= 0 ? index + 1 : index;
      }
    },
    absoluteIndexFromCenter() {
      return Math.abs(this.indexFromCenter);
    },
    marginLeft() {
      return this.indexFromCenter > 0
        ? this.totalCards % 2
          ? `calc(-1/4 * var(--base-size))`
          : `calc(-1/8 * var(--base-size))`
        : undefined;
    },
    marginRight() {
      return this.indexFromCenter < 0
        ? this.totalCards % 2
          ? `calc(-1/4 * var(--base-size))`
          : `calc(-1/8 * var(--base-size))`
        : undefined;
    },
    rotate() {
      // return this.indexFromCenter * 3;
      return 0;
    },
    translateX() {
      return `calc(-50% + ${this.indexFromCenter2 * 100}%)`;
    }
    // translateY() {
    //   return this.isSelected ? "-20%" : "0%";
    // },
    // transform() {
    //   return `translate(${this.translateX}, ${this.translateY})`;
    // }
  }
};
</script>
<style scoped lang="less">
.april-card-container {
  left: 50%;
  transition: transform 1s, top 0.2s;
}
.april-card-wrapper {
  width: var(--base-size);
  // transition: transform 0.2s;
}
// .april-card-wrapper--selected {
//   transform: translateY(-30%);
// }
.april-card {
  width: 100%;
  padding-bottom: 120%;
  // border-radius: 6px;
  // background: #fff;
  // border: 1px solid #eee;
  background: url("/images/april/chess_card.png") center / 100% no-repeat;
}
.april-card--selected {
  background-image: url("/images/april/chess_card_selected.png");
}
.april-card-background {
  border-radius: 6px;
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-card-background--rook,
.april-card-background--pawn {
  background-size: 45%;
}
.april-card-background--queen {
  background-size: 70%;
}
.april-card-background--knight,
.april-card-background--king {
  background-size: 60%;
}
</style>
