<template>
  <div
    v-if="buff && buff.sourceId"
    class="battle-unit-buff inline-block relative"
    :class="
      'battle-unit-buff-type--' +
        buff.source +
        ' battle-unit-buff-terrain--' +
        terrainBase +
        ' battle-unit-buff--' +
        buff.sourceId
    "
  >
    <div
      class="buff-state-indicator absolute"
      :class="{ 'buff-state-indicator--positive': isPositive }"
    ></div>
    <div
      v-if="isValueVisible"
      class="buff-value absolute"
      :class="isSmallValue ? 'buff-value--small font-size-12' : 'font-size-18'"
    >
      {{ value }}
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  props: {
    buff: Object,
    value: Number,
    isSmallValue: Boolean
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game"]),
    terrainBase() {
      if (!(this.game && this.game.terrain && this.game.terrain.base)) {
        return "";
      }

      return this.game.terrain.base;
    },
    isValueVisible() {
      return typeof this.value === "number" && this.value > 0;
    },
    isPositive() {
      return (
        this.buff &&
        battle.BUFFS[this.buff.sourceId] &&
        battle.BUFFS[this.buff.sourceId].positive
      );
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit-buff {
  width: 5rem;
  height: 5rem;
  background-size: calc(100% - 2px);
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}
.buff-state-indicator {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px solid #f8781d;
}
.buff-state-indicator--positive {
  border-color: #42e624;
}
.buff-value {
  left: 0px;
  bottom: 0px;
  background: #fff;
  border: solid 2px #fff;
  color: #333;
  font-weight: 600;
  border-radius: 12px;
  padding: 0 3px;
  min-width: 17px;
}
.buff-value--small {
  padding: 0 1px;
  left: -3px;
  bottom: -3px;
  border-width: 1px;
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
// .battle-unit-buff-overlay {
//   background: #fff;
//   color: #000;
//   font-size: 42px;
//   border-radius: 50%;
//   font-weight: 900;
//   opacity: 0.5;
//   div {
//     opacity: 0.9;
//     text-shadow: 0px 0px 6px #fff;
//   }
// }
// .battle-unit-buff-type--attack {
//   background-image: url("/images/battle/abilities/attack.png");
// }
// .battle-unit-buff-type--jump {
//   background-image: url("/images/battle/abilities/jump.png");
// }
// .battle-unit-buff-type--buff {
//   background-image: url("/images/battle/abilities/buff.png");
// }
// .battle-unit-buff-type--self_buff {
//   background-image: url("/images/battle/abilities/self_buff.png");
// }
// .battle-unit-buff-type--de_buff {
//   background-image: url("/images/battle/abilities/de_buff.png");
// }
// .battle-unit-buff-type--healing {
//   background-image: url("/images/battle/abilities/heal.png");
// }
.battle-unit-buff--ice {
  background-image: url("/images/battle/tiles/snow_ice.png");
}
.battle-unit-buff--swamp {
  background-image: url("/images/battle/tiles/grass_swamp.png");
}
.battle-unit-buff--lava {
  background-image: url("/images/battle/tiles/sand_lava.png");
}
.battle-unit-buff--thorns {
  background-image: url("/images/battle/tiles/sand_thorns.png");
}
.battle-unit-buff--woods {
  background-image: url("/images/battle/tiles/grass_woods.png");
}
.battle-unit-buff--hill {
  background-image: url("/images/battle/tiles/grass_hill.png");
}

.battle-unit-buff-terrain--sand.battle-unit-buff--hill {
  background-image: url("/images/battle/tiles/sand_hill.png");
}
.battle-unit-buff-terrain--snow.battle-unit-buff--hill {
  background-image: url("/images/battle/tiles/snow_hill.png");
}
.battle-unit-buff-terrain--snow.battle-unit-buff--woods {
  background-image: url("/images/battle/tiles/snow_woods.png");
}

.battle-unit-buff--accurate_shot {
  background-image: url("/images/battle/abilities/accurate_shot.png");
}
.battle-unit-buff--agression {
  background-image: url("/images/battle/abilities/agression.png");
}
.battle-unit-buff--arrow_crush {
  background-image: url("/images/battle/abilities/arrow_crush.png");
}
.battle-unit-buff--axe_blow {
  background-image: url("/images/battle/abilities/axe_blow.png");
}
.battle-unit-buff--axe_crush {
  background-image: url("/images/battle/abilities/axe_crush.png");
}
.battle-unit-buff--blade_vortex {
  background-image: url("/images/battle/abilities/blade_vortex.png");
}
.battle-unit-buff--crush_of_doom {
  background-image: url("/images/battle/abilities/crush_of_doom.png");
}
.battle-unit-buff--curse {
  background-image: url("/images/battle/abilities/curse.png");
}
.battle-unit-buff--dark_vortex {
  background-image: url("/images/battle/abilities/dark_vortex.png");
}
.battle-unit-buff--dash {
  background-image: url("/images/battle/abilities/dash.png");
}
.battle-unit-buff--death_shot {
  background-image: url("/images/battle/abilities/death_shot.png");
}
.battle-unit-buff--double_shot {
  background-image: url("/images/battle/abilities/double_shot.png");
}
.battle-unit-buff--dragon_bite {
  background-image: url("/images/battle/abilities/dragon_bite.png");
}
.battle-unit-buff--dragon_fury {
  background-image: url("/images/battle/abilities/dragon_fury.png");
}
.battle-unit-buff--energy_bolt {
  background-image: url("/images/battle/abilities/energy_bolt.png");
}
.battle-unit-buff--fatal_strike {
  background-image: url("/images/battle/abilities/fatal_strike.png");
}
.battle-unit-buff--fire_blade {
  background-image: url("/images/battle/abilities/fire_blade.png");
}
.battle-unit-buff--flame_strike {
  background-image: url("/images/battle/abilities/flame_strike.png");
}
.battle-unit-buff--flight {
  background-image: url("/images/battle/abilities/flight.png");
}
.battle-unit-buff--frost_blade {
  background-image: url("/images/battle/abilities/frost_blade.png");
}
.battle-unit-buff--frozen_abyss {
  background-image: url("/images/battle/abilities/frozen_abyss.png");
}
.battle-unit-buff--fury_claws {
  background-image: url("/images/battle/abilities/fury_claws.png");
}
.battle-unit-buff--group_heal {
  background-image: url("/images/battle/abilities/group_heal.png");
}
.battle-unit-buff--hamstring {
  background-image: url("/images/battle/abilities/hamstring.png");
}
.battle-unit-buff--heal {
  background-image: url("/images/battle/abilities/heal.png");
}
.battle-unit-buff--initiative {
  background-image: url("/images/battle/abilities/initiative.png");
}
.battle-unit-buff--heavy_arrow {
  background-image: url("/images/battle/abilities/heavy_arrow.png");
}
.battle-unit-buff--heavy_strike {
  background-image: url("/images/battle/abilities/heavy_strike.png");
}
.battle-unit-buff--holy_strike {
  background-image: url("/images/battle/abilities/holy_strike.png");
}
.battle-unit-buff--hummer_blow {
  background-image: url("/images/battle/abilities/hummer_blow.png");
}
.battle-unit-buff--hurricane {
  background-image: url("/images/battle/abilities/hurricane.png");
}
.battle-unit-buff--javelin_throw {
  background-image: url("/images/battle/abilities/javelin_throw.png");
}
.battle-unit-buff--kunai_strike {
  background-image: url("/images/battle/abilities/kunai_strike.png");
}
.battle-unit-buff--laziness {
  background-image: url("/images/battle/abilities/laziness.png");
}
.battle-unit-buff--lethal_shot {
  background-image: url("/images/battle/abilities/lethal_shot.png");
}
.battle-unit-buff--lethal_strike {
  background-image: url("/images/battle/abilities/lethal_strike.png");
}
.battle-unit-buff--might {
  background-image: url("/images/battle/abilities/might.png");
}
.battle-unit-buff--mortal_blow {
  background-image: url("/images/battle/abilities/mortal_blow.png");
}
.battle-unit-buff--power_shot {
  background-image: url("/images/battle/abilities/power_shot.png");
}
.battle-unit-buff--power_strike {
  background-image: url("/images/battle/abilities/power_strike.png");
}
.battle-unit-buff--rage {
  background-image: url("/images/battle/abilities/rage.png");
}
.battle-unit-buff--retribution {
  background-image: url("/images/battle/abilities/retribution.png");
}
.battle-unit-buff--rush {
  background-image: url("/images/battle/abilities/rush.png");
}
.battle-unit-buff--shield {
  background-image: url("/images/battle/abilities/shield.png");
}
.battle-unit-buff--shield_strike {
  background-image: url("/images/battle/abilities/shield_strike.png");
}
.battle-unit-buff--shield_stun {
  background-image: url("/images/battle/abilities/shield_stun.png");
}
.battle-unit-buff--shield_wall {
  background-image: url("/images/battle/abilities/shield_wall.png");
}
.battle-unit-buff--spear_strike {
  background-image: url("/images/battle/abilities/spear_strike.png");
}
.battle-unit-buff--strong_punch {
  background-image: url("/images/battle/abilities/strong_punch.png");
}
.battle-unit-buff--stun {
  background-image: url("/images/battle/abilities/stun.png");
}
.battle-unit-buff--stun_shot {
  background-image: url("/images/battle/abilities/stun_shot.png");
}
.battle-unit-buff--sword_crush {
  background-image: url("/images/battle/abilities/sword_crush.png");
}
.battle-unit-buff--teleportation {
  background-image: url("/images/battle/abilities/teleportation.png");
}
.battle-unit-buff--weakness {
  background-image: url("/images/battle/abilities/weakness.png");
}
.battle-unit-buff--wind_walk {
  background-image: url("/images/battle/abilities/wind_walk.png");
}
.battle-unit-buff--wolf_bite {
  background-image: url("/images/battle/abilities/wolf_bite.png");
}
.battle-unit-buff--zealot {
  background-image: url("/images/battle/abilities/zealot.png");
}
.battle-unit-buff--move {
  background-image: url("/images/battle/abilities/move.png");
}
.battle-unit-buff--attack {
  background-image: url("/images/battle/abilities/attack.png");
}
</style>
