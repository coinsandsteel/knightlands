<template>
  <div
    class="battle-unit"
    :class="[
      unit
        ? 'battle-unit--tier-' +
          unit.tier +
          ' battle-unit' +
          '--' +
          unit.tribe +
          '_' +
          unit.class +
          ' battle-unit--template-' +
          (unit.template || unit.unitTemplate)
        : 'battle-unit--empty',
      isEnemy ? 'battle-unit--enemy' : '',
      shouldShowExtraInfo && isDead ? 'battle-unit--dead' : ''
    ]"
    @click="clickHandler"
  >
    <div class="battle-unit-wrapper relative">
      <div class="battle-unit-background-color absolute"></div>
      <div v-if="unit" class="battle-unit-image absolute"></div>
      <div class="battle-unit-background absolute-stretch"></div>
      <div class="absolute-stretch"></div>
      <div
        v-if="shouldShowExtraInfo && isHpVisible"
        class="absolute battle-unit-hp font-size-18 flex flex-center"
        :class="{
          'battle-unit-hp--warning': isHpWarning,
          'battle-unit-hp--danger': isHpDanger
        }"
      >
        {{ hp }}
      </div>
      <div
        v-if="shouldShowExtraInfo && unit && isActiveFighterId"
        class="absolute battle-active-fighter font-size-18"
      />
      <div
        v-if="shouldShowExtraInfo && isAttackTarget"
        class="absolute battle-attack-target font-size-18"
      />
      <div
        v-if="shouldShowExtraInfo && isHealTarget"
        class="absolute battle-heal-target font-size-18"
      />
      <!-- <div
        v-if="shouldShowExtraInfo && isDead"
        class="absolute battle-dead-indicator font-size-18"
      /> -->
      <!-- <div
        v-if="shouldShowExtraInfo && isStunned"
        class="absolute battle-stunned-indicator font-size-18"
      /> -->
      <div
        v-if="shouldShowExtraInfo && isRatingIndexVisible"
        class="absolute battle-rating-index font-size-18"
        :class="isSmallRatingIndex ? 'battle-rating-index--small' : ''"
      >
        {{ ratingIndex }}
      </div>
      <!-- isStunned isBuffIndicatorVisible -->
      <div
        v-if="shouldShowExtraInfo && (isStunned || isBuffIndicatorVisible)"
        class="battle-buff-indicator"
        :class="{
          'battle-buff-indicator--small': isBuffIndicatorSmall
        }"
      >
        <AsteriskIcon
          v-if="isBuffPositive"
          class="battle-buff-indicator-icon battle-buff-indicator-icon--green"
        />
        <AsteriskIcon
          v-if="isBuffNegative"
          class="battle-buff-indicator-icon battle-buff-indicator-icon--yellow"
        />
        <AsteriskIcon
          v-if="isStunned"
          class="battle-buff-indicator-icon battle-buff-indicator-icon--red"
        />
      </div>
      <div
        v-if="isQuantityVisible && quantity"
        class="absolute battle-unit-quantity font-size-20 font-outline-heavy"
      >
        x{{ quantity }}
      </div>
    </div>
  </div>
</template>
<script>
import AsteriskIcon from "./AsteriskIcon.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    AsteriskIcon
  },
  props: {
    unit: Object,
    ratingIndex: Number,
    isEnemy: Boolean,
    isSelected: Boolean,
    shouldShowExtraInfo: Boolean,
    isAttackTarget: Boolean,
    isHealTarget: Boolean,
    isActiveFighterId: Boolean,
    isHpVisible: Boolean,
    isSmallRatingIndex: Boolean,
    isBuffIndicatorVisible: Boolean,
    isBuffIndicatorSmall: Boolean,
    isQuantityVisible: Boolean
  },
  data() {
    return {};
  },
  computed: {
    hp() {
      return this.unit ? Math.max(0, this.unit.hp || 0) : null;
    },
    maxHp() {
      return this.unit &&
        this.unit.characteristics &&
        this.unit.characteristics.hp
        ? this.unit.characteristics.hp
        : 0;
    },
    isHpWarning() {
      return this.maxHp && this.hp / this.maxHp < 0.5;
    },
    isHpDanger() {
      return this.maxHp && this.hp / this.maxHp < 0.25;
    },
    isDead() {
      return (
        (this.unit && this.unit.isDead) ||
        (typeof this.hp === "number" && this.hp <= 0)
      );
    },
    isBuffPositive() {
      if (!(this.unit && this.unit.buffs)) {
        return false;
      }
      return this.unit.buffs.find(buff => {
        return (
          battle.BUFFS[buff.sourceId] && battle.BUFFS[buff.sourceId].positive
        );
      });
    },
    isBuffNegative() {
      if (!(this.unit && this.unit.buffs)) {
        return false;
      }
      return this.unit.buffs.find(buff => {
        return (
          battle.BUFFS[buff.sourceId] && !battle.BUFFS[buff.sourceId].positive
        );
      });
    },
    isStunned() {
      return this.unit && this.unit.isStunned;
    },
    isRatingIndexVisible() {
      return typeof this.ratingIndex === "number";
    },
    quantity() {
      return this.unit && this.unit.quantity ? this.unit.quantity : 0;
    }
  },
  methods: {
    clickHandler() {
      this.$emit("click", this.unit);
    }
  }
};
</script>
<style scoped lang="less">
@import (reference) "../../style/ui.less";
@import (reference) "../../style/common.less";
.battle-unit--dead {
  opacity: 0.3;
}
.battle-unit-hp {
  right: 0;
  top: 0;
  background: #fff;
  border: solid 1px #fff;
  // color: #333;
  color: #10b981;
  font-weight: 600;
  border-radius: 12px;
  padding: 0 5px;
  width: 17px;
  height: 16px;
}
.battle-unit-hp--warning {
  color: #f59e0b;
}
.battle-unit-hp--danger {
  color: #ef4444;
}
.battle-rating-index {
  right: 0px;
  bottom: 2px;
  background: #1e3a8a;
  border: solid 1px #1e3a8a;
  color: #fff;
  // color: #10b981;
  font-weight: 600;
  border-radius: 12px;
  padding: 0 5px;
}
.battle-rating-index--small {
  transform: scale(0.7);
  transform-origin: bottom right;
}
.battle-buff-indicator {
  position: absolute;
  height: 1.4rem;
  left: 10%;
  bottom: 10%;
  // display: flex;
}
.battle-buff-indicator-icon {
  width: 1.4rem;
  height: 1.4rem;
}
.battle-buff-indicator--small {
  height: 1rem;
  left: 8%;
  // bottom: 8%;
  // justify-content: end;
}
.battle-buff-indicator--small .battle-buff-indicator-icon {
  width: 1rem;
  height: 1rem;
}
.battle-buff-indicator-icon--green {
  color: #a3e635;
}
.battle-buff-indicator-icon--yellow {
  color: #f59e0b;
}
.battle-buff-indicator-icon--red {
  color: #ef4444;
}
.battle-active-fighter {
  top: 10%;
  left: 10%;
  width: 12%;
  height: 12%;
  border-radius: 50%;
  background: #a3e635;
}
.battle-attack-target {
  top: 10%;
  left: 10%;
  width: 12%;
  height: 12%;
  border-radius: 50%;
  background: #ef4444;
}
.battle-heal-target {
  top: 10%;
  left: 10%;
  width: 12%;
  height: 12%;
  border-radius: 50%;
  background: #2563eb;
}
// .battle-dead-indicator {
//   top: 1px;
//   left: 1px;
//   width: 20px;
//   height: 20px;
//   background: url("/images/battle/units/dead_unit.png") center/100% no-repeat;
// }
// .battle-stunned-indicator {
//   bottom: 2px;
//   right: 0;
//   width: 20px;
//   height: 20px;
//   background: url("/images/battle/effect/stunned.png") center/100% no-repeat;
// }
.battle-unit-wrapper {
  // background: url("/images/battle/units/unit.png") center/100% no-repeat;
  padding-bottom: 100%;
}
.battle-unit-quantity {
  right: 10%;
  top: 6%;
  color: #fff;
}
.battle-unit-background-color {
  background: #14b8a6;
  width: 100%;
  height: calc(12400% / 130);
  left: 0;
  top: 1%;
  border-radius: 14%;
}
.battle-unit--empty .battle-unit-background-color {
  background: #717171;
}
.battle-unit--enemy .battle-unit-background-color {
  background: #818cf8;
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
// .battle-unit--enemy .battle-unit-image {
//   background: url("/images/battle/enemy.png") center/80% no-repeat !important;
// }
// kobold
.battle-unit--template-4 .battle-unit-image,
.battle-unit--template-9 .battle-unit-image,
.battle-unit--template-10 .battle-unit-image {
  background: url("/images/battle/units/kobold-1.png") center/85% no-repeat;
}
.battle-unit--template-11 .battle-unit-image,
.battle-unit--template-12 .battle-unit-image,
.battle-unit--template-13 .battle-unit-image {
  background: url("/images/battle/units/kobold-2.png") center/85% no-repeat;
}
.battle-unit--template-14 .battle-unit-image,
.battle-unit--template-15 .battle-unit-image,
.battle-unit--template-16 .battle-unit-image {
  background: url("/images/battle/units/kobold-3.png") center/85% no-repeat;
}
.battle-unit--template-17 .battle-unit-image,
.battle-unit--template-18 .battle-unit-image,
.battle-unit--template-19 .battle-unit-image {
  background: url("/images/battle/units/kobold-4.png") center/85% no-repeat;
}
.battle-unit--template-20 .battle-unit-image,
.battle-unit--template-21 .battle-unit-image,
.battle-unit--template-22 .battle-unit-image {
  background: url("/images/battle/units/kobold-5.png") center/85% no-repeat;
}
// dwarf
.battle-unit--template-24 .battle-unit-image,
.battle-unit--template-25 .battle-unit-image,
.battle-unit--template-26 .battle-unit-image {
  background: url("/images/battle/units/dwarf-1.png") center/70% no-repeat;
}
.battle-unit--template-27 .battle-unit-image,
.battle-unit--template-28 .battle-unit-image,
.battle-unit--template-29 .battle-unit-image {
  background: url("/images/battle/units/dwarf-2.png") center/85% no-repeat;
}
.battle-unit--template-30 .battle-unit-image,
.battle-unit--template-31 .battle-unit-image,
.battle-unit--template-32 .battle-unit-image {
  background: url("/images/battle/units/dwarf-3.png") center/85% no-repeat;
}
.battle-unit--template-33 .battle-unit-image,
.battle-unit--template-34 .battle-unit-image,
.battle-unit--template-35 .battle-unit-image {
  background: url("/images/battle/units/dwarf-4.png") center/85% no-repeat;
}
.battle-unit--template-36 .battle-unit-image,
.battle-unit--template-37 .battle-unit-image,
.battle-unit--template-38 .battle-unit-image {
  background: url("/images/battle/units/dwarf-5.png") center/85% no-repeat;
}
// egypt
.battle-unit--template-39 .battle-unit-image,
.battle-unit--template-40 .battle-unit-image,
.battle-unit--template-41 .battle-unit-image {
  background: url("/images/battle/units/egypt-1.png") center/75% no-repeat;
}
.battle-unit--template-42 .battle-unit-image,
.battle-unit--template-43 .battle-unit-image,
.battle-unit--template-44 .battle-unit-image {
  background: url("/images/battle/units/egypt-2.png") center/58% no-repeat;
}
.battle-unit--template-45 .battle-unit-image,
.battle-unit--template-46 .battle-unit-image,
.battle-unit--template-47 .battle-unit-image {
  background: url("/images/battle/units/egypt-3.png") center/85% no-repeat;
}
.battle-unit--template-47 .battle-unit-image,
.battle-unit--template-48 .battle-unit-image,
.battle-unit--template-49 .battle-unit-image {
  background: url("/images/battle/units/egypt-4.png") center/72% no-repeat;
}
.battle-unit--template-50 .battle-unit-image,
.battle-unit--template-51 .battle-unit-image,
.battle-unit--template-52 .battle-unit-image {
  background: url("/images/battle/units/egypt-5.png") center/60% no-repeat;
}
// goblin
.battle-unit--template-54 .battle-unit-image,
.battle-unit--template-55 .battle-unit-image,
.battle-unit--template-56 .battle-unit-image {
  background: url("/images/battle/units/goblin-1.png") center/85% no-repeat;
}
.battle-unit--template-57 .battle-unit-image,
.battle-unit--template-58 .battle-unit-image,
.battle-unit--template-59 .battle-unit-image {
  background: url("/images/battle/units/goblin-2.png") center/85% no-repeat;
}
.battle-unit--template-60 .battle-unit-image,
.battle-unit--template-61 .battle-unit-image,
.battle-unit--template-62 .battle-unit-image {
  background: url("/images/battle/units/goblin-3.png") center/85% no-repeat;
}
.battle-unit--template-63 .battle-unit-image,
.battle-unit--template-64 .battle-unit-image,
.battle-unit--template-65 .battle-unit-image {
  background: url("/images/battle/units/goblin-4.png") center/70% no-repeat;
}
.battle-unit--template-66 .battle-unit-image,
.battle-unit--template-67 .battle-unit-image,
.battle-unit--template-68 .battle-unit-image {
  background: url("/images/battle/units/goblin-5.png") center/85% no-repeat;
}
// insect
.battle-unit--template-69 .battle-unit-image,
.battle-unit--template-70 .battle-unit-image,
.battle-unit--template-71 .battle-unit-image {
  background: url("/images/battle/units/insect-1.png") center/55% no-repeat;
}
.battle-unit--template-72.battle-unit-image,
.battle-unit--template-73 .battle-unit-image,
.battle-unit--template-74 .battle-unit-image {
  background: url("/images/battle/units/insect-2.png") center/53% no-repeat;
}
.battle-unit--template-75 .battle-unit-image,
.battle-unit--template-76 .battle-unit-image,
.battle-unit--template-77 .battle-unit-image {
  background: url("/images/battle/units/insect-3.png") center/62% no-repeat;
}
.battle-unit--template-78 .battle-unit-image,
.battle-unit--template-79 .battle-unit-image,
.battle-unit--template-80 .battle-unit-image {
  background: url("/images/battle/units/insect-4.png") center/82% no-repeat;
}
.battle-unit--template-81 .battle-unit-image,
.battle-unit--template-82 .battle-unit-image,
.battle-unit--template-83 .battle-unit-image {
  background: url("/images/battle/units/insect-5.png") center/75% no-repeat;
}
// orc
.battle-unit--template-84 .battle-unit-image,
.battle-unit--template-85 .battle-unit-image,
.battle-unit--template-86 .battle-unit-image {
  background: url("/images/battle/units/orc-1.png") center/75% no-repeat;
}
.battle-unit--template-87 .battle-unit-image,
.battle-unit--template-88 .battle-unit-image,
.battle-unit--template-89 .battle-unit-image {
  background: url("/images/battle/units/orc-2.png") center/85% no-repeat;
}
.battle-unit--template-90 .battle-unit-image,
.battle-unit--template-91 .battle-unit-image,
.battle-unit--template-92 .battle-unit-image {
  background: url("/images/battle/units/orc-3.png") center/85% no-repeat;
}
.battle-unit--template-93 .battle-unit-image,
.battle-unit--template-94 .battle-unit-image,
.battle-unit--template-95 .battle-unit-image {
  background: url("/images/battle/units/orc-4.png") center/75% no-repeat;
}
.battle-unit--template-96 .battle-unit-image,
.battle-unit--template-97 .battle-unit-image,
.battle-unit--template-98 .battle-unit-image {
  background: url("/images/battle/units/orc-5.png") center/75% no-repeat;
}
// assembling
.battle-unit--template-99 .battle-unit-image,
.battle-unit--template-100 .battle-unit-image,
.battle-unit--template-101 .battle-unit-image {
  background: url("/images/battle/units/assembling-1.png") center/80% no-repeat;
}
.battle-unit--template-102 .battle-unit-image,
.battle-unit--template-103 .battle-unit-image,
.battle-unit--template-104 .battle-unit-image {
  background: url("/images/battle/units/assembling-2.png") center/85% no-repeat;
}
.battle-unit--template-105 .battle-unit-image,
.battle-unit--template-106 .battle-unit-image,
.battle-unit--template-107 .battle-unit-image {
  background: url("/images/battle/units/assembling-3.png") center/85% no-repeat;
}
.battle-unit--template-108 .battle-unit-image,
.battle-unit--template-109 .battle-unit-image,
.battle-unit--template-110 .battle-unit-image {
  background: url("/images/battle/units/assembling-4.png") center/80% no-repeat;
}
.battle-unit--template-111 .battle-unit-image,
.battle-unit--template-112 .battle-unit-image,
.battle-unit--template-113 .battle-unit-image {
  background: url("/images/battle/units/assembling-5.png") center/65% no-repeat;
}
// clockwork
.battle-unit--template-114 .battle-unit-image,
.battle-unit--template-115 .battle-unit-image,
.battle-unit--template-116 .battle-unit-image {
  background: url("/images/battle/units/clockwork-1.png") center/85% no-repeat;
}
.battle-unit--template-117 .battle-unit-image,
.battle-unit--template-118 .battle-unit-image,
.battle-unit--template-119 .battle-unit-image {
  background: url("/images/battle/units/clockwork-2.png") center/70% no-repeat;
}
.battle-unit--template-120 .battle-unit-image,
.battle-unit--template-123 .battle-unit-image,
.battle-unit--template-124 .battle-unit-image {
  background: url("/images/battle/units/clockwork-3.png") center/75% no-repeat;
}
.battle-unit--template-125 .battle-unit-image,
.battle-unit--template-126 .battle-unit-image,
.battle-unit--template-127 .battle-unit-image {
  background: url("/images/battle/units/clockwork-4.png") center/85% no-repeat;
}
.battle-unit--template-128 .battle-unit-image,
.battle-unit--template-129 .battle-unit-image,
.battle-unit--template-130 .battle-unit-image {
  background: url("/images/battle/units/clockwork-5.png") center/70% no-repeat;
}
// skeleton
.battle-unit--template-131 .battle-unit-image,
.battle-unit--template-132 .battle-unit-image,
.battle-unit--template-133 .battle-unit-image {
  background: url("/images/battle/units/skeleton-1.png") center/85% no-repeat;
}
.battle-unit--template-134 .battle-unit-image,
.battle-unit--template-135 .battle-unit-image,
.battle-unit--template-136 .battle-unit-image {
  background: url("/images/battle/units/skeleton-2.png") center/85% no-repeat;
}
.battle-unit--template-137 .battle-unit-image,
.battle-unit--template-138 .battle-unit-image,
.battle-unit--template-139 .battle-unit-image {
  background: url("/images/battle/units/skeleton-3.png") center/85% no-repeat;
}
.battle-unit--template-140 .battle-unit-image,
.battle-unit--template-141 .battle-unit-image,
.battle-unit--template-142 .battle-unit-image {
  background: url("/images/battle/units/skeleton-4.png") center/85% no-repeat;
}
.battle-unit--template-143 .battle-unit-image,
.battle-unit--template-144 .battle-unit-image,
.battle-unit--template-145 .battle-unit-image {
  background: url("/images/battle/units/skeleton-5.png") center/85% no-repeat;
}
// ice
.battle-unit--template-146 .battle-unit-image,
.battle-unit--template-147 .battle-unit-image,
.battle-unit--template-148 .battle-unit-image {
  background: url("/images/battle/units/ice-1.png") center/85% no-repeat;
}
.battle-unit--template-149 .battle-unit-image,
.battle-unit--template-150 .battle-unit-image,
.battle-unit--template-151 .battle-unit-image {
  background: url("/images/battle/units/ice-2.png") center/85% no-repeat;
}
.battle-unit--template-152 .battle-unit-image,
.battle-unit--template-153 .battle-unit-image,
.battle-unit--template-154 .battle-unit-image {
  background: url("/images/battle/units/ice-3.png") center/85% no-repeat;
}
.battle-unit--template-155 .battle-unit-image,
.battle-unit--template-158 .battle-unit-image,
.battle-unit--template-159 .battle-unit-image {
  background: url("/images/battle/units/ice-4.png") center/80% no-repeat;
}
.battle-unit--template-160 .battle-unit-image,
.battle-unit--template-161 .battle-unit-image,
.battle-unit--template-162 .battle-unit-image {
  background: url("/images/battle/units/ice-5.png") center/85% no-repeat;
}
// elf
.battle-unit--template-163 .battle-unit-image,
.battle-unit--template-165 .battle-unit-image,
.battle-unit--template-166 .battle-unit-image {
  background: url("/images/battle/units/elf-1.png") center/72% no-repeat;
}
.battle-unit--template-167 .battle-unit-image,
.battle-unit--template-168 .battle-unit-image,
.battle-unit--template-169 .battle-unit-image {
  background: url("/images/battle/units/elf-2.png") center/85% no-repeat;
}
.battle-unit--template-170 .battle-unit-image,
.battle-unit--template-171 .battle-unit-image,
.battle-unit--template-172 .battle-unit-image {
  background: url("/images/battle/units/elf-3.png") center/85% no-repeat;
}
.battle-unit--template-173 .battle-unit-image,
.battle-unit--template-174 .battle-unit-image,
.battle-unit--template-175 .battle-unit-image {
  background: url("/images/battle/units/elf-4.png") center/65% no-repeat;
}
.battle-unit--template-176 .battle-unit-image,
.battle-unit--template-177 .battle-unit-image,
.battle-unit--template-178 .battle-unit-image {
  background: url("/images/battle/units/elf-5.png") center/65% no-repeat;
}
// eldritch
.battle-unit--template-179 .battle-unit-image,
.battle-unit--template-180 .battle-unit-image,
.battle-unit--template-181 .battle-unit-image {
  background: url("/images/battle/units/eldritch-1.png") center/50% no-repeat;
}
.battle-unit--template-182 .battle-unit-image,
.battle-unit--template-183 .battle-unit-image,
.battle-unit--template-184 .battle-unit-image {
  background: url("/images/battle/units/eldritch-2.png") center/85% no-repeat;
}
.battle-unit--template-185 .battle-unit-image,
.battle-unit--template-186 .battle-unit-image,
.battle-unit--template-187 .battle-unit-image {
  background: url("/images/battle/units/eldritch-3.png") center/85% no-repeat;
}
.battle-unit--template-188 .battle-unit-image,
.battle-unit--template-189 .battle-unit-image,
.battle-unit--template-190 .battle-unit-image {
  background: url("/images/battle/units/eldritch-4.png") center/85% no-repeat;
}
.battle-unit--template-191 .battle-unit-image,
.battle-unit--template-192 .battle-unit-image,
.battle-unit--template-193 .battle-unit-image {
  background: url("/images/battle/units/eldritch-5.png") center/53% no-repeat;
}
// fallen-king
.battle-unit--template-194 .battle-unit-image,
.battle-unit--template-195 .battle-unit-image,
.battle-unit--template-196 .battle-unit-image {
  background: url("/images/battle/units/fallen-king-1.png") center/70% no-repeat;
}
.battle-unit--template-197 .battle-unit-image,
.battle-unit--template-198 .battle-unit-image,
.battle-unit--template-199 .battle-unit-image {
  background: url("/images/battle/units/fallen-king-2.png") center/85% no-repeat;
}
.battle-unit--template-200 .battle-unit-image,
.battle-unit--template-201 .battle-unit-image,
.battle-unit--template-202 .battle-unit-image {
  background: url("/images/battle/units/fallen-king-3.png") center/85% no-repeat;
}
.battle-unit--template-203 .battle-unit-image,
.battle-unit--template-204 .battle-unit-image,
.battle-unit--template-205 .battle-unit-image {
  background: url("/images/battle/units/fallen-king-4.png") center/85% no-repeat;
}
.battle-unit--template-206 .battle-unit-image,
.battle-unit--template-207 .battle-unit-image,
.battle-unit--template-208 .battle-unit-image {
  background: url("/images/battle/units/fallen-king-5.png") center/75% no-repeat;
}
// legendary
.battle-unit--template-209 .battle-unit-image,
.battle-unit--template-210 .battle-unit-image,
.battle-unit--template-211 .battle-unit-image {
  background: url("/images/battle/units/legendary-1.png") center/85% no-repeat;
}
.battle-unit--template-212 .battle-unit-image,
.battle-unit--template-213 .battle-unit-image,
.battle-unit--template-214 .battle-unit-image {
  background: url("/images/battle/units/legendary-2.png") center/85% no-repeat;
}
.battle-unit--template-215 .battle-unit-image,
.battle-unit--template-216 .battle-unit-image,
.battle-unit--template-217 .battle-unit-image {
  background: url("/images/battle/units/legendary-3.png") center/85% no-repeat;
}
.battle-unit--template-218 .battle-unit-image,
.battle-unit--template-219 .battle-unit-image,
.battle-unit--template-220 .battle-unit-image {
  background: url("/images/battle/units/legendary-4.png") center/85% no-repeat;
}
.battle-unit--template-221 .battle-unit-image,
.battle-unit--template-222 .battle-unit-image,
.battle-unit--template-223 .battle-unit-image {
  background: url("/images/battle/units/legendary-5.png") center/65% no-repeat;
}
// titan
.battle-unit--template-224 .battle-unit-image,
.battle-unit--template-225 .battle-unit-image,
.battle-unit--template-226 .battle-unit-image {
  background: url("/images/battle/units/titan-1.png") center/85% no-repeat;
}
.battle-unit--template-227 .battle-unit-image,
.battle-unit--template-228 .battle-unit-image,
.battle-unit--template-229 .battle-unit-image {
  background: url("/images/battle/units/titan-2.png") center/85% no-repeat;
}
.battle-unit--template-230 .battle-unit-image,
.battle-unit--template-231 .battle-unit-image,
.battle-unit--template-232 .battle-unit-image {
  background: url("/images/battle/units/titan-3.png") center/85% no-repeat;
}
.battle-unit--template-233 .battle-unit-image,
.battle-unit--template-234 .battle-unit-image,
.battle-unit--template-235 .battle-unit-image {
  background: url("/images/battle/units/titan-4.png") center/85% no-repeat;
}
.battle-unit--template-236 .battle-unit-image,
.battle-unit--template-237 .battle-unit-image,
.battle-unit--template-238 .battle-unit-image {
  background: url("/images/battle/units/titan-5.png") center/85% no-repeat;
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
