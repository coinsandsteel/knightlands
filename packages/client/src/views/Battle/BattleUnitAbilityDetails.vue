<template>
  <div>
    <div class="flex flex-item-center" :class="{ 'opacity-50': isLocked }">
      <BattleUnitAbility :ability="ability" />
      <div class="margin-left-1">
        {{ description }}
      </div>
      <div class="margin-left-1">
        <!-- <CustomButton
          v-if="ability && ability.level > 0 && ability.level < 4"
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="upgradeHandler"
        >
          {{ $t("upgrade") }}
        </CustomButton> -->

        <CustomButton
          v-if="ability && nextLevel && !isLocked && upgradePrice"
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="upgradeHandler"
        >
          {{ $t("Upgrade lvl " + nextLevel) }}
          <IconWithValue
            :flip="false"
            :iconMargin="true"
            iconClass="icon-gold"
            class="pointer"
          >
            {{ upgradePrice }}
          </IconWithValue>
        </CustomButton>
      </div>
    </div>
    <div class="text-align-left">
      <CustomButton
        type="blue"
        class="inline-block margin-right-2 margin-top-1"
        @click="increaseHandler"
      >
        {{ $t("lvl+") }}
      </CustomButton>

      <CustomButton
        type="blue"
        class="inline-block margin-right-2 margin-top-1"
        @click="decreaseHandler"
      >
        {{ $t("lvl-") }}
      </CustomButton>
    </div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
import BattleAbilityLevelUpConfirm from "@/views/Battle/BattleAbilityLevelUpConfirm.vue";
import BattleAbilityLearnConfirm from "@/views/Battle/BattleAbilityLearnConfirm.vue";

export default {
  props: {
    unit: Object,
    ability: Object
  },
  components: {
    BattleUnitAbility
  },
  data() {
    return {};
  },
  computed: {
    currentLevel() {
      return this.ability && this.ability.level
        ? this.ability.level.current
        : null;
    },
    nextLevel() {
      return this.ability && this.ability.level
        ? this.ability.level.next
        : null;
    },
    upgradePrice() {
      return this.ability && this.ability.level
        ? this.ability.level.price
        : null;
    },
    isLocked() {
      return this.ability && !this.currentLevel;
    },
    name() {
      const value = this.ability ? this.ability.abilityClass : null;

      if (!value) {
        return null;
      }

      return value;
    },
    level() {
      const value =
        this.ability && this.ability.level ? this.ability.level.current : null;

      if (!value) {
        return null;
      }

      return "level: " + value;
    },
    damage() {
      const value = this.ability ? this.ability.damage : null;

      if (!value) {
        return null;
      }

      return "damage: " + (value > 0 ? "+" : "") + value;
    },
    defence() {
      const value = this.ability ? this.ability.defence : null;

      if (!value) {
        return null;
      }

      return "defence: " + (value > 0 ? "+" : "-") + value;
    },
    speed() {
      const value = this.ability ? this.ability.speed : null;

      if (!value) {
        return null;
      }

      return "speed: " + (value > 0 ? "+" : "-") + value;
    },
    description() {
      const items = [];

      if (this.name) {
        items.push(this.name);
      }
      if (this.level) {
        items.push(this.level);
      }
      if (this.damage) {
        items.push(this.damage);
      }
      if (this.defence) {
        items.push(this.defence);
      }
      if (this.speed) {
        items.push(this.speed);
      }

      return items.join(", ");
    }
  },
  methods: {
    // async upgradeHandler() {
    //   const show = create(BattleAbilityLevelUpConfirm);
    //   await show();
    // },
    async upgradeHandler() {
      // const show = create(BattleAbilityLearnConfirm);
      // await show();
      this.$store.dispatch("battle/upgradeUnitAbility", {
        unitId: this.unit.unitId,
        abilityClass: this.ability.abilityClass
      });
    },
    increaseHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "increaseAbilityLevel",
        unitId: this.unit.unitId,
        abilityClass: this.ability.abilityClass
      });
    },
    decreaseHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "decreaseAbilityLevel",
        unitId: this.unit.unitId,
        abilityClass: this.ability.abilityClass
      });
    }
  }
};
</script>
<style scoped lang="scss"></style>
