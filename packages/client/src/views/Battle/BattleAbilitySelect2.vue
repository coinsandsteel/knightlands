<template>
  <div class="battle-ability-select flex flex-center pointer-events-none">
    <div
      class="battle-ability-select-wrapper font-size-22 relative  overflow-hidden"
      :style="{ '--base-size': `${appSize.width}px` }"
    >
      <div class="absolute-stretch opacity-70">
        <!-- center -->
        <div class="center-ability absolute pointer-events-auto"></div>
        <!-- top -->
        <div
          class="top-ability absolute flex flex-center pointer-events-auto"
          @click.stop="close(topAbility)"
        >
          <div class="ability-border absolute pointer-events-none"></div>
          <BattleUnitAbility
            v-if="topAbility"
            :ability="topAbility"
            class="pointer-events-none"
          />
        </div>
        <!-- right / close -->
        <div
          class="right-ability absolute flex flex-center pointer-events-auto"
          @click.stop="close()"
        >
          <div class="ability-border absolute pointer-events-none"></div>
          <CloseButton />
          <!-- <BattleUnitAbility
          v-if="rightAbility"
          :ability="rightAbility"
          class="pointer-events-none"
        /> -->
        </div>
        <!-- bottom -->
        <div
          class="bottom-ability absolute flex flex-center pointer-events-auto"
          @click.stop="close(bottomAbility)"
        >
          <div class="ability-border absolute pointer-events-none"></div>
          <BattleUnitAbility
            v-if="bottomAbility"
            :ability="bottomAbility"
            class="pointer-events-none"
          />
        </div>
        <!-- left -->
        <div
          class="left-ability absolute flex flex-center pointer-events-auto"
          @click.stop="close(leftAbility)"
        >
          <div class="ability-border absolute pointer-events-none"></div>
          <BattleUnitAbility
            v-if="leftAbility"
            :ability="leftAbility"
            class="pointer-events-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
import CloseButton from "@/components/CloseButton.vue";

export default {
  components: {
    BattleUnitAbility,
    CloseButton
  },
  props: {
    activeFighterId: String,
    isAttackCellSelected: Boolean
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["appSize"]),
    ...mapGetters("battle", ["units", "enemyUnits"]),
    unit() {
      return [...this.units, ...this.enemyUnits].find(
        ({ fighterId }) => fighterId === this.activeFighterId
      );
    },
    abilities() {
      const abilities =
        this.unit && this.unit.abilities
          ? this.unit.abilities.filter(({ enabled }) => enabled)
          : [];
      return abilities;

      // return abilities.filter(ability => {
      //   const isNonTarget =
      //     ability.abilityClass === battle.ABILITY_GROUP_HEAL ||
      //     ability.abilityClass === battle.ABILITY_AXE_BLOW ||
      //     battle.ABILITY_TYPES[ability.abilityClass] ===
      //       battle.ABILITY_TYPE_SELF_BUFF;

      //   return this.isAttackCellSelected ? !isNonTarget : isNonTarget;
      // });
    },
    topAbility() {
      return this.abilities.length > 0 ? this.abilities[0] : null;
    },
    rightAbility() {
      return this.abilities.length > 1 ? this.abilities[1] : null;
    },
    bottomAbility() {
      return this.abilities.length > 2 ? this.abilities[2] : null;
    },
    leftAbility() {
      return this.abilities.length > 3 ? this.abilities[3] : null;
    }
  },
  methods: {
    close(result) {
      console.log("close", result);
      this.$emit("close", result);
    }
  }
};
</script>
<style scoped lang="scss">
$width: 60px;
.battle-unit-ability {
  width: $width;
  height: $width;
}
.battle-ability-select {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  // background: rgba(#000, 0.557);
}
.battle-ability-select-wrapper {
  height: 100%;
  width: var(--base-size);
  // background: rgba(#f00, 0.2);
}
.center-ability {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: rgba(#fff, 0.2);
  right: 0;
  bottom: 150px;
}
.top-ability {
  // top: -14px;
  // left: 50%;
  // transform: translate(-50%, -100%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
  right: 55px;
  bottom: 193px;
}
.left-ability {
  // top: 50%;
  // left: -14px;
  // transform: translate(-100%, -50%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
  right: 66px;
  bottom: 133px;
}
.right-ability {
  // top: 50%;
  // right: -14px;
  // transform: translate(100%, -50%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
  right: 0;
  bottom: 220px;
}
.bottom-ability {
  // bottom: -14px;
  // left: 50%;
  // transform: translate(-50%, 100%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
  right: 27px;
  bottom: 85px;
}
.ability-border {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  border: 2px solid #fff;
  background: rgba(#fff, 0.2);
  // transform: rotate(45deg);
}
.close-btn {
  right: unset;
  top: unset;
}
</style>
