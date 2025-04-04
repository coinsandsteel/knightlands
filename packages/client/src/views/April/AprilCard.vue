<template>
  <div
    class="april-card-container absolute"
    :style="style"
    @click="$emit('click', card)"
  >
    <div class="april-card-wrapper">
      <div
        class="april-card relative"
        :class="[
          `april-card--${card.cardClass}`,
          {
            'april-card--selected': isSelected,
            'april-card--flipped': isFlipped
          }
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
import { sleep } from "@/helpers/utils";

export default {
  props: {
    card: Object,
    index: Number,
    totalCards: Number
  },
  data() {
    return {
      isFlipped: false
    };
  },
  computed: {
    ...mapGetters("april", ["selectedCard"]),
    cardClass() {
      return this.card ? this.card.cardClass : null;
    },
    isSelected() {
      return (
        this.card && this.selectedCard && this.card.id === this.selectedCard.id
      );
    },
    indexFromCenter() {
      return this.index + 0.5 - this.totalCards / 2;
    },
    translateX() {
      return `${(this.indexFromCenter || 0) * 100 - 50}%`;
    },
    transform() {
      return `translateX(${this.translateX})`;
    },
    style() {
      return {
        top: this.isSelected ? "calc(-0.4 * var(--base-size))" : 0,
        transform: `translateX(${this.translateX})`,
        zIndex: this.index + 1
      };
    }
  },
  watch: {
    cardClass(value) {
      if (!value) {
        return;
      }
      this.animateCardClassChanged();
    }
  },
  methods: {
    async animateCardClassChanged() {
      this.isFlipped = true;
      await sleep(800);
      this.isFlipped = false;
    }
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
// animation
.april-card--flipped {
  transform-style: preserve-3d;
  animation: flip 0.8s;
}
// animate
@keyframes flip {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
}
</style>
