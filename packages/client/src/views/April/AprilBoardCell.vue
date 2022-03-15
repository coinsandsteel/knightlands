<template>
  <div
    class="april-board-cell-container relative"
    :class="{
      'april-board-cell-container--black': index % 2 === 0,
      'z-index-1': isHero
    }"
  >
    <div class="april-board-cell absolute-stretch">
      <Transition name="fade" appear>
        <div
          v-if="isHitZone"
          class="april-board-cell-hit-zone absolute-stretch"
        />
      </Transition>
      <Transition name="fade" appear>
        <div
          v-if="isAvailableMove"
          class="april-board-cell-available-move absolute-stretch"
        />
      </Transition>
      <Transition name="fade" appear>
        <div
          v-if="isEnemy"
          class="april-board-cell-enemy april-board-cell-enemy--teeth absolute-stretch"
        />
      </Transition>
      <Transition
        :_mame="
          heroIndex === index && oldHeroIndex !== index ? 'hero-move' : 'none'
        "
        @enter="heroEnterHandler"
        @leave="heroLeaveHandler"
      >
        <div
          v-if="isHero"
          class="april-board-cell-hero april-board-cell-hero--knight absolute-stretch"
          :class="{ 'hero-move-active': isHeroMoveActive }"
        />
      </Transition>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
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
      isHeroMoveActive: false
    };
  },
  computed: {
    // ...mapState("april", ["cells", "moveZones"]),
    ...mapGetters("april", ["cards", "damage", "units"]),
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
      // return this.moveZones && this.moveZones.includes(this.index);
      return [2, 9, 15].includes(this.index);
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
      done();
    },
    heroLeaveHandler(el, done) {
      done();
    }
  }
};
</script>
<style scoped lang="less">
.april-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  background: #fff;
}
.april-board-cell-container--black {
  background: #222;
}
.april-board-cell {
}
.april-board-cell-hit-zone {
  background: url("/images/april/hit_zone.svg") center/22% repeat;
}
.april-board-cell-available-move {
  // background-color: rgba(#ef4444, 0.5);
  background-color: rgba(#10b981, 0.3);
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
}
// animate
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
.april-board-cell-hero.hero-move-active {
  transition: transform 0.8s;
}
</style>
