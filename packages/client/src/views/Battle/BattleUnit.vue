<template>
  <div
    class="battle-unit"
    :class="[
      unit
        ? 'battle-unit--tier-' +
          unit.tier +
          ' battle-unit' +
          '--' +
          unit.unitTribe +
          '_' +
          unit.unitClass
        : 'battle-unit--empty',
      isEnemy ? 'battle-unit--enemy' : ''
    ]"
    @click="clickHandler"
  >
    <div class="battle-unit-wrapper relative">
      <div class="battle-unit-background-color absolute"></div>
      <div v-if="unit" class="battle-unit-image absolute"></div>
      <div class="battle-unit-background absolute-stretch"></div>
      <div class="absolute-stretch"></div>
      <div
        v-if="shouldShowExtraInfo"
        class="absolute battle-unit-hp font-size-18"
      >
        {{ hp }}
      </div>
      <div
        v-if="
          shouldShowExtraInfo &&
            unit &&
            activeFighterId &&
            unit.fighterId === activeFighterId
        "
        class="absolute battle-active-fighter font-size-18"
      />
      <div
        v-if="shouldShowExtraInfo && isAttackTarget"
        class="absolute battle-attack-target font-size-18"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  props: {
    unit: Object,
    isEnemy: Boolean,
    isSelected: Boolean,
    shouldShowExtraInfo: Boolean,
    isAttackTarget: Boolean
  },
  data() {
    return {
      // isSelected1: false
    };
  },
  computed: {
    ...mapGetters("battle", ["activeFighterId"]),
    hp() {
      return this.unit ? this.unit.hp || 0 : null;
    }
  },
  methods: {
    clickHandler() {
      // this.isSelected1 = !this.isSelected1;
      this.$emit("click", this.unit);
    }
  }
};
</script>
<style scoped lang="less">
@import (reference) "../../style/ui.less";
@import (reference) "../../style/common.less";
.battle-unit-hp {
  right: 0;
  top: 0;
  background: #fff;
  border: solid 1px #777;
  // color: #333;
  color: #10b981;
  font-weight: 600;
  border-radius: 12px;
  padding: 0 4px;
}
.battle-active-fighter {
  bottom: 2px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a3e635;
}
.battle-attack-target {
  bottom: 2px;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: red;
}
.battle-unit-wrapper {
  // background: url("/images/battle/units/unit.png") center/100% no-repeat;
  padding-bottom: 100%;
}
.battle-unit-background-color {
  background: #00a3ee;
  // background: red;
  width: 100%;
  height: calc(12400% / 130);
  left: 0;
  top: 1%;
  border-radius: 14%;
}
.battle-unit-background {
  background: url("/images/battle/portrait_border.png") center/100% no-repeat;
}
.battle-unit--tier-1 .battle-unit-background {
  background: url("/images/battle/portrait_border_green.png") center/100%
    no-repeat;
}
.battle-unit--tier-2 .battle-unit-background {
  background: url("/images/battle/portrait_border_blue.png") center/100%
    no-repeat;
}
.battle-unit--tier-3 .battle-unit-background {
  background: url("/images/battle/portrait_border_purple.png") center/100%
    no-repeat;
}
.battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
  width: 100%;
  height: calc(12400% / 130);
  left: 0;
  top: 1%;
  border-radius: 14%;
}
.battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
  width: 100%;
  height: calc(12400% / 130);
  left: 0;
  top: 1%;
  border-radius: 14%;
}
.battle-unit--enemy .battle-unit-image {
  background: url("/images/battle/enemy.png") center/80% no-repeat !important;
}
// kobold
.battle-unit--kobold_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--kobold_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--kobold_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--kobold_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--kobold_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// dwarf
.battle-unit--dwarf_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--dwarf_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--dwarf_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--dwarf_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--dwarf_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// egyptian
.battle-unit--egyptian_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--egyptian_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--egyptian_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--egyptian_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--egyptian_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// goblin
.battle-unit--goblin_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--goblin_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--goblin_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--goblin_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--goblin_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// insect
.battle-unit--insect_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--insect_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--insect_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--insect_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--insect_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// orc
.battle-unit--orc_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--orc_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--orc_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--orc_tank .battle-unit-image {
  background: url("/images/battle/enemy.png") center/80% no-repeat;
}
.battle-unit--orc_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// clockwork
.battle-unit--clockwork_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--clockwork_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--clockwork_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--clockwork_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--clockwork_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// skeleton
.battle-unit--skeleton_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--skeleton_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--skeleton_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--skeleton_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--skeleton_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// ice
.battle-unit--ice_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--ice_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--ice_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--ice_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--ice_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// elf
.battle-unit--elf_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--elf_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--elf_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--elf_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--elf_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// eldritch
.battle-unit--eldritch_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--eldritch_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--eldritch_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--eldritch_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--eldritch_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// assembling
.battle-unit--assembling_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--assembling_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--assembling_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--assembling_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--assembling_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// fallen_knight
.battle-unit--fallen_knight_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// fallen_knight
.battle-unit--fallen_knight_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--fallen_knight_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// titan
.battle-unit--titan_range .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--titan_melee .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--titan_mage .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--titan_tank .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-unit--titan_support .battle-unit-image {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
// .battle-unit--empty .battle-unit-wrapper {
//   background-image: url("/images/battle/units/unit-empty.png");
// }
// .battle-unit--melee .battle-unit-wrapper {
//   background-image: url("/images/battle/units/unit-melee.png");
// }
// .battle-unit--range .battle-unit-wrapper {
//   background-image: url("/images/battle/units/unit-range.png");
// }
// .battle-unit--mage .battle-unit-wrapper {
//   background-image: url("/images/battle/units/unit-mage.png");
// }
// .battle-unit--tank .battle-unit-wrapper {
//   background-image: url("/images/battle/units/unit-tank.png");
// }
// .battle-unit--support .battle-unit-wrapper {
//   background-image: url("/images/battle/units/unit-support.png");
// }
// .battle-unit--selected .battle-unit-wrapper {
//   background-image: url("/images/battle/unit_bg_selected.png");
// }
</style>
