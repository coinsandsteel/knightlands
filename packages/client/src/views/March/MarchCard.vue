<template>
  <div
    v-if="card"
    ref="card"
    class="march-card relative restrict-selection pointer"
    :class="[
      `march-card--${card.unitClass}`,
      `march-card--${card.unitClass}--${card.unitIndex + 1}`,
      {
        'march-card--pet': card.isPet,
        'march-card--adjacent': card.isAdjacent,
        [`march-card--${card.unitClass}--opened`]: card.opened
      }
    ]"
    @click="clickHandler"
  >
    <div
      v-if="card.isPet"
      class="absolute march-pet-element-background-color"
    ></div>
    <div
      v-if="card.isPet"
      class="absolute march-pet-element-background"
      :class="'march-pet-element-background--' + pet.petClass"
    ></div>
    <div class="march-card-container absolute-stretch width-100 height-100">
      <div
        class="march-card-unit-background absolute-stretch"
        :class="card.isPet ? `march-pet-${pet.petClass}-${pet.level}` : ''"
      ></div>
      <!-- @todo: remove -->
      <!-- <div
        class="font-size-22 absolute"
        style="top: 14px; left: 0; width: 100%"
      >
        {{ card.unitClass }} {{ card.opened ? " - opened" : "" }}
      </div> -->
      <div
        v-if="isHpVisible"
        class="march-card-hp absolute-top-left flex flex-center line-height-0 font-size-25 font-weight-700 relative"
        :class="{ 'march-card-hp--closed-trap': isClosedTrap }"
      >
        {{ isClosedTrap ? 0 : card.hp }}
      </div>
      <div
        v-if="secondaryHp"
        class="march-card-secondary-hp absolute-top-right flex flex-center line-height-0 font-size-25 font-weight-700"
      >
        {{ secondaryHp }}
      </div>
      <div class="march-card-effects absolute-stretch width-100 height-100" />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import useSwipe from "@/helpers/useSwipe";
import * as march from "@/../../knightlands-shared/march";

export default {
  props: {
    card: Object
  },
  data() {
    return {
      unregisterEvents: null
    };
  },
  computed: {
    ...mapState("march", ["pet"]),
    isClosedTrap() {
      return (
        this.card &&
        this.card.unitClass === march.UNIT_CLASS_TRAP &&
        !this.card.opened
      );
    },
    canSwipe() {
      return this.card && this.card.canSwipe;
    },
    secondaryHp() {
      if (!this.card) {
        return null;
      }

      if (
        this.card.unitClass === march.UNIT_CLASS_PET &&
        this.pet &&
        this.pet.armor > 0
      ) {
        return this.pet.armor;
      }

      if (
        this.card.unitClass === march.UNIT_CLASS_BOMB &&
        this.card.timer >= 0
      ) {
        return this.card.timer;
      }

      return null;
    },
    isHpVisible() {
      if (!this.card || this.card.unitClass === march.UNIT_CLASS_CHEST) {
        return false;
      }
      return this.card.hp || this.isClosedTrap;
    }
  },
  watch: {
    canSwipe(value) {
      this.checkEvents(value);
    }
  },
  methods: {
    checkEvents(canSwipe) {
      if (canSwipe) {
        if (this.unregisterEvents) {
          return;
        }
        this.registerEvents();
      } else if (this.unregisterEvents) {
        this.unregisterEvents();
        this.unregisterEvents = null;
      }
    },

    registerEvents() {
      const {
        registerEvents: register,
        unregisterEvents: unregister
      } = useSwipe();
      register(this.$refs.card, this.swipeHandler);
      this.unregisterEvents = unregister;
    },

    swipeHandler(direction) {
      this.$emit("swipe", direction);
    },

    clickHandler(event) {
      if (!(this.card && this.card.canClick)) {
        return;
      }
      this.$emit("click", event);
    }
  },
  mounted() {
    this.checkEvents(this.canSwipe);
  },
  beforeDestroy() {
    if (this.unregisterEvents) {
      this.unregisterEvents();
      this.unregisterEvents = null;
    }
  }
};
</script>
<style scoped lang="less">
.march-card {
  padding-bottom: 100%;
  background-image: url("/images/march/card_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
}
.march-card--enemy {
  background-image: url("/images/march/card_bg_enemy.png");
}
.march-card--enemyBoss {
  background-image: url("/images/march/card_bg_boss.png");
}
.march-card--pet {
  background-image: none;
  z-index: 1;
}
.march-pet-element-background-color {
  background-color: #00a3ee;
  background-size: 100%;
  background-repeat: no-repeat;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  top: 5px;
  left: 5px;
}
.march-pet-element-background {
  background-size: 100%;
  background-repeat: no-repeat;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  top: 5px;
  left: 5px;
}
.march-card-unit-background {
  background-position: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
}
// .march-card--pet .march-card-unit-background {
//   background-image: url("/images/march/pets/pet_1_1.png");
// }
.march-card--ballLightning .march-card-unit-background {
  background-image: url("/images/march/cards/ball_lightning.png");
}
.march-card--dragonBreath .march-card-unit-background {
  background-image: url("/images/march/cards/dragon_breath.png");
}
.march-card--bomb .march-card-unit-background {
  background-image: url("/images/march/cards/bomb.png");
}
.march-card--bow .march-card-unit-background {
  background-image: url("/images/march/cards/bow.png");
}
.march-card--chest .march-card-unit-background {
  background-image: url("/images/march/cards/chest.png");
}
.march-card--barrel .march-card-unit-background {
  background-image: url("/images/march/cards/barrel.png");
}
.march-card--enemy .march-card-unit-background {
  background-image: url("/images/march/enemies/enemy_1.png");
}
.march-card--enemy--2 .march-card-unit-background {
  background-image: url("/images/march/enemies/enemy_2.png");
}
.march-card--enemy--3 .march-card-unit-background {
  background-image: url("/images/march/enemies/enemy_3.png");
}
.march-card--enemy--4 .march-card-unit-background {
  background-image: url("/images/march/enemies/enemy_4.png");
}
.march-card--enemy--5 .march-card-unit-background {
  background-image: url("/images/march/enemies/enemy_5.png");
}
.march-card--enemy--6 .march-card-unit-background {
  background-image: url("/images/march/enemies/enemy_6.png");
}
.march-card--enemyBoss .march-card-unit-background {
  background-image: url("/images/march/enemies/boss_1.png");
}
.march-card--enemyBoss--2 .march-card-unit-background {
  background-image: url("/images/march/enemies/boss_2.png");
}
.march-card--enemyBoss--3 .march-card-unit-background {
  background-image: url("/images/march/enemies/boss_3.png");
}
.march-card--enemyBoss--4 .march-card-unit-background {
  background-image: url("/images/march/enemies/boss_4.png");
}
.march-card--trap .march-card-unit-background {
  background-image: url("/images/march/cards/trap.png");
  background-size: 30%;
}
.march-card--trap--opened .march-card-unit-background {
  background-image: url("/images/march/cards/trap_opened.png");
  background-size: 50%;
}
.march-card--hp .march-card-unit-background {
  background-image: url("/images/march/cards/hp.png");
}
.march-card--extraHp .march-card-unit-background {
  background-image: url("/images/march/cards/extra_life.png");
}
.march-card--armor .march-card-unit-background {
  background-image: url("/images/march/cards/armor.png");
}
.march-card--gold .march-card-unit-background {
  background-image: url("/images/march/march_gold_pack.png");
}
.march-card-hp,
.march-card-secondary-hp {
  width: 4rem;
  height: 4rem;
  color: #0f2b44;
  background-image: url("/images/march/green_marker.png");
  background-size: 100%;
  background-repeat: no-repeat;
  transform: translate(10%, 0);
}
.march-card-secondary-hp {
  transform: translate(-10%, 0);
  background-image: url("/images/march/blue_marker.png");
  color: #fff;
}
// .march-card--pet .march-card-hp,
// .march-card--ballLightning .march-card-hp,
// .march-card--dragonBreath .march-card-hp,
// .march-card--bomb .march-card-hp,
// .march-card--bow .march-card-hp,
// .march-card--chest .march-card-hp,
// .march-card--barrel .march-card-hp,
.march-card--enemy .march-card-hp,
.march-card--enemyBoss .march-card-hp,
.march-card--trap .march-card-hp:not(.march-card-hp--closed-trap)
// .march-card--hp .march-card-hp,
// .march-card--extraHp .march-card-hp,
// .march-card--armor .march-card-hp,
// .march-card--gold .march-card-hp
 {
  background-image: url("/images/march/red_marker.png");
  color: #fff;
}
// .march-card--pet {
//   .march-card-hp,
//   .march-card-secondary-hp {
//     transform: translate(-20%, -20%);
//   }
// }
.march-card-effects {
  z-index: 1;
}
.march-card-effects::v-deep .march-arrow-effect {
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-image: url("/images/march/arrow.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 40%;
    z-index: 2;
  }
  &.march-arrow-effect--top {
    transform: rotate(-90deg);
  }
  &.march-arrow-effect--top::after {
    transform: rotate(-90deg);
  }
  &.march-arrow-effect--bottom::after {
    transform: rotate(90deg);
  }
  &.march-arrow-effect--left::after {
    transform: rotate(180deg);
  }
}
</style>
