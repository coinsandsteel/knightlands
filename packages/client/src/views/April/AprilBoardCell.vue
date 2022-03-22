<template>
  <div
    class="april-board-cell-container relative"
    :class="{
      'april-board-cell-container--black': index % 2 === 0,
      'z-index-1': isHero
    }"
    @click="clickHandler"
  >
    <div class="april-board-cell absolute-stretch">
      <!-- available move -->
      <Transition name="fade" appear>
        <div
          v-if="isAvailableMove"
          class="april-board-cell-available-move absolute-stretch"
        />
      </Transition>
      <!-- hit zone -->
      <Transition name="fade" appear>
        <div
          v-if="isHitZoneLocal"
          ref="hitZone"
          class="april-board-cell-hit-zone absolute-stretch"
          :class="{ 'hit-zone-animating': isHitZoneAnimating }"
        >
          <div
            v-if="damagePoint > 1"
            class="april-damage-point absolute font-size-15"
          >
            {{ damagePoint }}
          </div>
        </div>
      </Transition>
      <!-- enemy -->
      <Transition name="fade" appear>
        <div
          v-if="isEnemy"
          class="april-board-cell-enemy april-board-cell-enemy--teeth absolute-stretch"
          :class="`april-board-cell-enemy--${unit.unitClass}`"
        />
      </Transition>
      <!-- hero -->
      <Transition @enter="heroEnterHandler" @leave="heroLeaveHandler">
        <div
          v-if="isHero"
          class="april-board-cell-hero-wrapper absolute-stretch"
          :class="{
            'hero-move-active': isHeroMoveActive
          }"
        >
          <div
            class="april-board-cell-hero absolute-stretch"
            :class="[
              `april-board-cell-hero--${heroClass}`,
              {
                'hero-battle-active': isBattleActive
              }
            ]"
          ></div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { sleep } from "@/helpers/utils";
import * as april from "@/../../knightlands-shared/april";

export default {
  props: {
    index: Number
    // card: Object
  },
  data() {
    return {
      isHero: false,
      oldHeroIndex: 22,
      isHeroMoveActive: false,
      isBattleActive: false,
      canAnimate: false,
      wasHit: false,
      isHitZoneLocal: false,
      isHitZoneAnimating: false
    };
  },
  computed: {
    ...mapState("april", ["heroClass", "hp", "isDisabled"]),
    ...mapGetters("april", ["cards", "damage", "units", "moveZones"]),
    unit() {
      if (this.units) {
        return this.units.find(({ index }) => index === this.index);
      }

      return null;
    },
    // isHero() {
    //   return this.unit && this.unit.unitClass === april.UNIT_CLASS_HERO;
    // },
    isEnemy() {
      return (
        this.unit &&
        this.unit.unitClass &&
        this.unit.unitClass !== april.UNIT_CLASS_HERO
      );
    },
    isAvailableMove() {
      return this.moveZones.includes(this.index);
    },
    damagePoint() {
      return (this.damage && this.damage[this.index]) || 0;
    },
    isHitZone() {
      return this.damagePoint > 0;
    },
    heroIndex() {
      if (!this.units) {
        return null;
      }

      const hero = this.units.find(
        ({ unitClass }) => unitClass === april.UNIT_CLASS_HERO
      );

      if (!hero) {
        return null;
      }

      return hero.index;
    }
  },

  watch: {
    heroIndex(value, oldValue) {
      if (typeof value === "number" && value === this.index) {
        if (typeof oldValue === "number") {
          this.oldHeroIndex = oldValue;
        }
        this.isHero = true;
        return;
      }
      this.isHero = false;
    },
    async hp(value, oldValue) {
      if (value < oldValue && this.isHero) {
        this.wasHit = true;
        await sleep(800);
        await this.animateHeroBattle();
        this.wasHit = false;
      }
    },
    async isHitZone(value) {
      if (this.wasHit && this.isHitZoneLocal) {
        await sleep(1000);
      }
      this.isHitZoneLocal = value;
    }
  },

  mounted() {
    this.isHero = this.heroIndex === this.index;
    this.isHitZoneLocal = this.isHitZone;
    setTimeout(() => {
      this.canAnimate = true;
    }, 800);
  },

  methods: {
    async heroEnterHandler(el, done) {
      if (!this.canAnimate) {
        done();
        return;
      }
      if (
        !(this.heroIndex === this.index && this.oldHeroIndex !== this.index)
      ) {
        return;
      }
      const xDiff = (this.oldHeroIndex % 5) - (this.index % 5);
      const yDiff =
        Math.floor(this.oldHeroIndex / 5) - Math.floor(this.index / 5);
      el.style = `transform: translate(calc(${xDiff *
        0.8} * var(--base-size)), calc(${yDiff * 0.8} * var(--base-size)));`;
      this.isHeroMoveActive = true;
      await sleep(10);
      el.removeAttribute("style");
      await sleep(800);
      this.isHeroMoveActive = false;

      done();
    },
    heroLeaveHandler(el, done) {
      done();
    },
    async animateHeroBattle() {
      this.isBattleActive = true;
      if (this.isHitZoneLocal) {
        this.isHitZoneAnimating = true;
      }
      await sleep(100);
      this.isBattleActive = false;
      await sleep(100);
      this.isBattleActive = true;
      await sleep(100);
      this.isBattleActive = false;
      await sleep(100);
      this.isBattleActive = true;
      await sleep(100);
      this.isBattleActive = false;
      await sleep(100);
      this.isHitZoneAnimating = false;
    },
    clickHandler() {
      if (this.isDisabled) {
        return;
      }
      if (!this.isAvailableMove) {
        return;
      }

      this.$emit("click");
    }
  }
};
</script>
<style scoped lang="less">
.april-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  // background: #245178;
}
.april-board-cell-container--black {
  // background: #12283d;
}
.april-board-cell {
}
.april-board-cell-hit-zone {
  background: url("/images/april/hit_zone.png") center/80% no-repeat;
}
.april-board-cell-available-move {
  background: url("/images/april/move_direction.png") center/100% no-repeat;
  // background-color: rgba(#ef4444, 0.5);
  // background-color: #10b981;
  // opacity: 0.3;
}
.april-board-cell-enemy {
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-board-cell-hero {
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  transition: all 0.1;
}
.april-board-cell-hero-wrapper.hero-move-active {
  transition: transform 0.5s, filter 0.1s;
}
.hero-battle-active {
  filter: brightness(0%);
}
.april-damage-point {
  left: 0;
  top: 0;
  color: #fff;
  line-height: 1;
}
.hit-zone-animating {
  animation: shake 0.4s;
}
// animate
@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg) scale(1);
    filter: brightness(100%);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg) scale(1.2);
    filter: brightness(200%);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg) scale(1.4);
    filter: brightness(100%);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg) scale(1.6);
    filter: brightness(200%);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg) scale(1.8);
    filter: brightness(100%);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg) scale(2);
    filter: brightness(200%);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg) scale(1.8);
    filter: brightness(100%);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg) scale(1.6);
    filter: brightness(200%);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg) scale(1.4);
    filter: brightness(100%);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg) scale(1.2);
    filter: brightness(200%);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg) scale(1);
    filter: brightness(100%);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
// .fade-enter-active {
//   opacity: 0.5;
// }
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
