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
      <!-- hit zone -->
      <Transition name="fade" appear>
        <div
          v-if="isHitZone"
          class="april-board-cell-hit-zone absolute-stretch"
        >
          <div
            v-if="damagePoint > 1"
            class="april-damage-point absolute font-size-15"
          >
            {{ damagePoint }}
          </div>
        </div>
      </Transition>
      <!-- available move -->
      <Transition name="fade" appear>
        <div
          v-if="isAvailableMove"
          class="april-board-cell-available-move absolute-stretch"
        />
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
      isBattleActive: false
    };
  },
  computed: {
    ...mapState("april", ["heroClass"]),
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
    }
  },

  mounted() {
    this.isHero = this.heroIndex === this.index;
  },

  methods: {
    async heroEnterHandler(el, done) {
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

      // @todo: check in hit zone
      if (true) {
        setTimeout(this.animateHeroBattle, 100);
      }
      done();
    },
    heroLeaveHandler(el, done) {
      done();
    },
    async animateHeroBattle() {
      this.isBattleActive = true;
      await sleep(100);
      this.isBattleActive = false;
      await sleep(100);
      this.isBattleActive = true;
      await sleep(100);
      this.isBattleActive = false;
    },
    clickHandler() {
      // @todo: uncomment
      // if (!this.isAvailableMove) {
      //   return;
      // }

      this.$emit("click");
    }
  }
};
</script>
<style scoped lang="less">
.april-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  background: #245178;
}
.april-board-cell-container--black {
  background: #12283d;
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
  transition: transform 0.8s;
}
.hero-battle-active {
  filter: brightness(240%);
}
.april-damage-point {
  left: 0;
  top: 0;
  color: #fff;
  line-height: 1;
}
// animate
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
