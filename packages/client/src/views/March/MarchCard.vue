<template>
  <div
    v-if="card"
    ref="card"
    class="march-card relative restrict-selection pointer"
    :class="[
      `march-card--${card.unitClass}`,
      {
        'march-card--pet': card.isPet,
        'march-card--adjacent': card.isAdjacent,
        [`march-card--${card.unitClass}--opened`]: card.opened
      }
    ]"
    @click="clickHandler"
  >
    <div class="march-card-container absolute-stretch width-100 height-100">
      <div class="march-card-unit-background absolute-stretch"></div>
      <!-- @todo: remove -->
      <div
        class="font-size-22 absolute"
        style="top: 14px; left: 0; width: 100%"
      >
        {{ card.unitClass }} {{ card.opened ? " - opened" : "" }}
      </div>
      <div
        v-if="card.hp"
        class="march-card-hp absolute-top-left flex flex-center line-height-0 font-size-25 font-weight-700"
      >
        {{ card.hp }}
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

      return null;
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
  // background: rgba(255, 0, 0, 0.2);
  background-image: url("/images/march/card_bg.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
}
.march-card-unit-background {
  background-position: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
}
.march-card--pet .march-card-unit-background {
  background-image: url("/images/march/pets/pet_1_1.png");
}
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
  background-image: url("/images/march/cards/enemy.png");
}
.march-card--enemyBoss .march-card-unit-background {
  background-image: url("/images/march/cards/enemy_boss.png");
}
.march-card--trap .march-card-unit-background {
  background-image: url("/images/march/cards/trap.png");
}
.march-card--trap--opened .march-card-unit-background {
  background-image: url("/images/march/cards/trap_opened.png");
}
.march-card--hp .march-card-unit-background {
  background-image: url("/images/march/cards/hp.png");
}
.march-card--extraHp .march-card-unit-background {
  background-image: url("/images/march/cards/extra_hp.png");
}
.march-card--armor .march-card-unit-background {
  background-image: url("/images/march/cards/armor.png");
}
.march-card--gold .march-card-unit-background {
  background-image: url("/images/march/march_gold.png");
  background-size: 25%;
}
.march-card-hp,
.march-card-secondary-hp {
  // background: #fff;
  // border: 0.5rem solid #222;
  // border-radius: 50%;
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
.march-card--chest .march-card-hp,
.march-card--barrel .march-card-hp,
.march-card--enemy .march-card-hp,
.march-card--enemyBoss .march-card-hp,
.march-card--trap .march-card-hp
// .march-card--hp .march-card-hp,
// .march-card--extraHp .march-card-hp,
// .march-card--armor .march-card-hp,
// .march-card--gold .march-card-hp
 {
  background-image: url("/images/march/red_marker.png");
  color: #fff;
}
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
    // background: rgba(yellow, 0.5);
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
