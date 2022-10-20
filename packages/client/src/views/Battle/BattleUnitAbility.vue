<template>
  <div
    v-if="ability"
    class="battle-unit-ability inline-block relative"
    :class="
      'battle-unit-ability-type--' +
        ability.abilityType +
        ' battle-unit-ability--' +
        ability.abilityClass
    "
  >
    <div
      v-if="hasOverlayText"
      class="battle-unit-ability-overlay width-100 height-100 flex flex-center"
    >
      <div>{{ overlayText }}</div>
    </div>
    <div v-if="isActive" class="active-indicator absolute"></div>
    <div
      v-if="isInfoIconVisible"
      class="ability-info-icon absolute flex flex-center font-size-18"
    >
      &ifr;
    </div>
    <div
      v-if="isValueVisible"
      class="ability-value absolute flex flex-center"
      :class="
        isSmallValue ? 'ability-value--small font-size-12' : 'font-size-18'
      "
    >
      {{ value }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ability: Object,
    isActive: Boolean,
    value: Number,
    isSmallValue: Boolean,
    overlayText: String
  },
  data() {
    return {};
  },
  computed: {
    isInfoIconVisible() {
      return (
        this.isActive && !["move", "attack"].includes(this.ability.abilityClass)
      );
    },
    isValueVisible() {
      return (
        ["attack", "healing"].includes(this.ability.abilityType) &&
        typeof this.value === "number" &&
        this.value > 0
      );
    },
    hasOverlayText() {
      return (
        typeof this.overlayText === "string" && this.overlayText.length > 0
      );
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit-ability {
  width: 4rem;
  height: 4rem;
  background-image: url("/images/battle/abilities/ability-1.png");
  border-radius: 50%;
  background-size: 100%;
  background-repeat: none;
  position: relative;
}
.active-indicator {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid #10b981;
  border-radius: 50%;
}
.ability-value {
  left: 0;
  bottom: 0;
  background: #fff;
  // border: solid 2px #fff;
  color: #333;
  // color: #10b981;
  font-weight: 600;
  line-height: 1;
  border-radius: 50%;
  // padding: 0 3px;
  // min-width: 17px;
  width: 3rem;
  height: 3rem;
  width: calc(var(--base-size) * 0.25);
  height: calc(var(--base-size) * 0.25);
  font-size: calc(var(--base-size) * 0.14);
}
.ability-value--small {
  padding: 0 1px;
  left: -4px;
  bottom: -4px;
  border-width: 0;
  width: 2rem;
  height: 2rem;
  font-size: 1.25rem;
}
.ability-info-icon {
  left: -15%;
  bottom: 35%;
  background: #fff;
  // border: solid 2px #fff;
  color: #333;
  // color: #10b981;
  font-weight: 600;
  border-radius: 12px;
  // padding: 0 3px;
  // min-width: 17px;
  // width: 17px;
  // height: 17px;
  width: calc(var(--base-size) * 0.25);
  height: calc(var(--base-size) * 0.25);
  font-size: calc(var(--base-size) * 0.14);
}
// .battle-unit-ability-overlay {
//   background: rgba(#fff, 0.5);
//   color: #fff;
//   font-size: 42px;
//   border-radius: 50%;
//   font-weight: 900;
//   div {
//     text-shadow: 0px 0px 6px #000;
//   }
// }
.battle-unit-ability-overlay {
  background: #fff;
  color: #000;
  font-size: 42px;
  border-radius: 50%;
  font-weight: 900;
  opacity: 0.5;
  div {
    opacity: 0.9;
    text-shadow: 0px 0px 6px #fff;
  }
}
.battle-unit-ability-type--attack {
  background-image: url("/images/battle/abilities/attack.png");
}
.battle-unit-ability-type--jump {
  background-image: url("/images/battle/abilities/jump.png");
}
.battle-unit-ability-type--buff {
  background-image: url("/images/battle/abilities/buff.png");
}
.battle-unit-ability-type--self_buff {
  background-image: url("/images/battle/abilities/self_buff.png");
}
.battle-unit-ability-type--de_buff {
  background-image: url("/images/battle/abilities/de_buff.png");
}
.battle-unit-ability-type--healing {
  background-image: url("/images/battle/abilities/heal.png");
}
.battle-unit-ability--accurate_shot {
  background-image: url("/images/battle/abilities/accurate_shot.png");
}
.battle-unit-ability--agression {
  background-image: url("/images/battle/abilities/agression.png");
}
.battle-unit-ability--arrow_crush {
  background-image: url("/images/battle/abilities/arrow_crush.png");
}
.battle-unit-ability--axe_blow {
  background-image: url("/images/battle/abilities/axe_blow.png");
}
.battle-unit-ability--axe_crush {
  background-image: url("/images/battle/abilities/axe_crush.png");
}
.battle-unit-ability--blade_vortex {
  background-image: url("/images/battle/abilities/blade_vortex.png");
}
.battle-unit-ability--crush_of_doom {
  background-image: url("/images/battle/abilities/crush_of_doom.png");
}
.battle-unit-ability--curse {
  background-image: url("/images/battle/abilities/curse.png");
}
.battle-unit-ability--dark_vortex {
  background-image: url("/images/battle/abilities/dark_vortex.png");
}
.battle-unit-ability--dash {
  background-image: url("/images/battle/abilities/dash.png");
}
.battle-unit-ability--death_shot {
  background-image: url("/images/battle/abilities/death_shot.png");
}
.battle-unit-ability--double_shot {
  background-image: url("/images/battle/abilities/double_shot.png");
}
.battle-unit-ability--dragon_bite {
  background-image: url("/images/battle/abilities/dragon_bite.png");
}
.battle-unit-ability--dragon_fury {
  background-image: url("/images/battle/abilities/dragon_fury.png");
}
.battle-unit-ability--energy_bolt {
  background-image: url("/images/battle/abilities/energy_bolt.png");
}
.battle-unit-ability--fatal_strike {
  background-image: url("/images/battle/abilities/fatal_strike.png");
}
.battle-unit-ability--fire_blade {
  background-image: url("/images/battle/abilities/fire_blade.png");
}
.battle-unit-ability--flame_strike {
  background-image: url("/images/battle/abilities/flame_strike.png");
}
.battle-unit-ability--flight {
  background-image: url("/images/battle/abilities/flight.png");
}
.battle-unit-ability--frost_blade {
  background-image: url("/images/battle/abilities/frost_blade.png");
}
.battle-unit-ability--frozen_abyss {
  background-image: url("/images/battle/abilities/frozen_abyss.png");
}
.battle-unit-ability--fury_claws {
  background-image: url("/images/battle/abilities/fury_claws.png");
}
.battle-unit-ability--group_heal {
  background-image: url("/images/battle/abilities/group_heal.png");
}
.battle-unit-ability--hamstring,
.battle-unit-ability--hamstring_shot {
  background-image: url("/images/battle/abilities/hamstring.png");
}
.battle-unit-ability--heal {
  background-image: url("/images/battle/abilities/heal.png");
}
.battle-unit-ability--initiative {
  background-image: url("/images/battle/abilities/initiative.png");
}
.battle-unit-ability--heavy_arrow {
  background-image: url("/images/battle/abilities/heavy_arrow.png");
}
.battle-unit-ability--heavy_strike {
  background-image: url("/images/battle/abilities/heavy_strike.png");
}
.battle-unit-ability--holy_strike {
  background-image: url("/images/battle/abilities/holy_strike.png");
}
.battle-unit-ability--hummer_blow {
  background-image: url("/images/battle/abilities/hummer_blow.png");
}
.battle-unit-ability--hurricane {
  background-image: url("/images/battle/abilities/hurricane.png");
}
.battle-unit-ability--javelin_throw {
  background-image: url("/images/battle/abilities/javelin_throw.png");
}
.battle-unit-ability--kunai_strike {
  background-image: url("/images/battle/abilities/kunai_strike.png");
}
.battle-unit-ability--laziness {
  background-image: url("/images/battle/abilities/laziness.png");
}
.battle-unit-ability--lethal_shot {
  background-image: url("/images/battle/abilities/lethal_shot.png");
}
.battle-unit-ability--lethal_strike {
  background-image: url("/images/battle/abilities/lethal_strike.png");
}
.battle-unit-ability--might {
  background-image: url("/images/battle/abilities/might.png");
}
.battle-unit-ability--mortal_blow {
  background-image: url("/images/battle/abilities/mortal_blow.png");
}
.battle-unit-ability--power_shot {
  background-image: url("/images/battle/abilities/power_shot.png");
}
.battle-unit-ability--power_strike {
  background-image: url("/images/battle/abilities/power_strike.png");
}
.battle-unit-ability--rage {
  background-image: url("/images/battle/abilities/rage.png");
}
.battle-unit-ability--retribution {
  background-image: url("/images/battle/abilities/retribution.png");
}
.battle-unit-ability--rush {
  background-image: url("/images/battle/abilities/rush.png");
}
.battle-unit-ability--shield {
  background-image: url("/images/battle/abilities/shield.png");
}
.battle-unit-ability--shield_strike {
  background-image: url("/images/battle/abilities/shield_strike.png");
}
.battle-unit-ability--shield_stun {
  background-image: url("/images/battle/abilities/shield_stun.png");
}
.battle-unit-ability--shield_wall {
  background-image: url("/images/battle/abilities/shield_wall.png");
}
.battle-unit-ability--spear_strike {
  background-image: url("/images/battle/abilities/spear_strike.png");
}
.battle-unit-ability--strong_punch {
  background-image: url("/images/battle/abilities/strong_punch.png");
}
.battle-unit-ability--stun {
  background-image: url("/images/battle/abilities/stun.png");
}
.battle-unit-ability--stun_shot {
  background-image: url("/images/battle/abilities/stun_shot.png");
}
.battle-unit-ability--sword_crush {
  background-image: url("/images/battle/abilities/sword_crush.png");
}
.battle-unit-ability--teleportation {
  background-image: url("/images/battle/abilities/teleportation.png");
}
.battle-unit-ability--weakness {
  background-image: url("/images/battle/abilities/weakness.png");
}
.battle-unit-ability--wind_walk {
  background-image: url("/images/battle/abilities/wind_walk.png");
}
.battle-unit-ability--wolf_bite {
  background-image: url("/images/battle/abilities/wolf_bite.png");
}
.battle-unit-ability--zealot {
  background-image: url("/images/battle/abilities/zealot.png");
}
.battle-unit-ability--move {
  background-image: url("/images/battle/abilities/move.png");
}
.battle-unit-ability--attack {
  background-image: url("/images/battle/abilities/attack.png");
}
</style>
