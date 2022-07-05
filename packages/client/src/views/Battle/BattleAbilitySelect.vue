<template>
  <div class="battle-ability-select flex flex-center pointer" @click="close()">
    <div class="font-size-22 relative">
      <!-- center -->
      <div class="center-ability"></div>
      <!-- top -->
      <div
        class="top-ability absolute flex flex-center"
        @click.stop="close(topAbility)"
      >
        <div class="ability-border absolute pointer-events-none"></div>
        <BattleUnitAbility
          v-if="topAbility"
          :ability="topAbility"
          class="pointer-events-none"
        />
      </div>
      <!-- right -->
      <div
        class="right-ability absolute flex flex-center"
        @click.stop="close(rightAbility)"
      >
        <div class="ability-border absolute pointer-events-none"></div>
        <BattleUnitAbility
          v-if="rightAbility"
          :ability="rightAbility"
          class="pointer-events-none"
        />
      </div>
      <!-- bottom -->
      <div
        class="bottom-ability absolute flex flex-center"
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
        class="left-ability absolute flex flex-center"
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
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
export default {
  components: {
    BattleUnitAbility
  },
  props: {
    selectedFighterId: String
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("battle", ["units", "enemyUnits"]),
    unit() {
      return [...this.units, ...this.enemyUnits].find(
        ({ fighterId }) => fighterId === this.selectedFighterId
      );
    },
    abilities() {
      return this.unit && this.unit.abilities
        ? this.unit.abilities.filter(({ enabled }) => enabled)
        : [];
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
      this.$emit("close", result);
    }
  }
};
</script>
<style scoped lang="scss">
$width: 60px;
.battle-ability-select {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.557);
}
.center-ability {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.top-ability {
  top: -14px;
  left: 50%;
  transform: translate(-50%, -100%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.left-ability {
  top: 50%;
  left: -14px;
  transform: translate(-100%, -50%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.right-ability {
  top: 50%;
  right: -14px;
  transform: translate(100%, -50%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.bottom-ability {
  bottom: -14px;
  left: 50%;
  transform: translate(-50%, 100%);

  width: $width;
  height: $width;
  // border: 1px solid #f00;
}
.ability-border {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid #fff;
  transform: rotate(45deg);
}
</style>
