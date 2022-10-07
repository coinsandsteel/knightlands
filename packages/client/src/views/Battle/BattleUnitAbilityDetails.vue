<template>
  <div>
    <div
      v-if="ability"
      class="flex"
      :class="{ 'opacity-50': !(ability && ability.enabled) }"
    >
      <BattleUnitAbility
        :ability="ability"
        :value="ability.value"
        :isSmallValue="true"
        class="margin-top-half"
      />
      <div class="flex-full margin-left-1 text-align-left">
        <div class="flex flex-center">
          <div class="flex-full">
            <div>
              {{
                name +
                  (ability.tier ? ", tier: " + ability.tier : "") +
                  (level ? ", level: " + level : "") +
                  (!isUpgradeVisible && value ? ", damage/heal: " + value : "")
              }}
            </div>
            <div v-if="isUpgradeVisible">Damage/Heal: {{ value }}</div>
          </div>
          <div v-if="isUpgradeVisible" class="margin-left-1">
            <!-- <CustomButton
          v-if="ability && ability.level > 0 && ability.level < 4"
          type="green"
          class="inline-block margin-right-2 margin-top-1"
          @click="upgradeHandler"
        >
          {{ $t("upgrade") }}
        </CustomButton> -->

            <CustomButton
              v-if="ability && nextLevel && upgradePrice"
              type="green"
              class="inline-block margin-right-2 margin-top-1"
              @click="upgradeHandler"
            >
              {{ $t("Upgrade lvl " + nextLevel) }}
              <!-- <IconWithValue
            :flip="false"
            :iconMargin="true"
            iconClass="icon-gold"
            class="pointer"
          >
            {{ upgradePrice }}
          </IconWithValue> -->
              <BattleCoin :value="upgradePrice" class="margin-left-1" />
            </CustomButton>
          </div>
        </div>
        <div
          v-if="
            ability &&
              ability.abilityClass &&
              $t('battle-ability-description-' + ability.abilityClass)
          "
          class=""
        >
          {{ $t("battle-ability-description-" + ability.abilityClass) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { create } from "vue-modal-dialogs";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
// import BattleAbilityLevelUpConfirm from "@/views/Battle/BattleAbilityLevelUpConfirm.vue";
// import BattleAbilityLearnConfirm from "@/views/Battle/BattleAbilityLearnConfirm.vue";

export default {
  props: {
    unit: Object,
    ability: Object,
    isUpgradeVisible: {
      type: Boolean,
      default: true
    }
  },
  components: {
    BattleUnitAbility,
    BattleCoin
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

      return this.$t("battle-ability-" + value);
    },
    level() {
      const value =
        this.ability && this.ability.level ? this.ability.level.current : null;

      if (!value) {
        return null;
      }

      return value;
    },
    value() {
      const value = this.ability ? this.ability.value : null;

      if (!value) {
        return null;
      }

      // return (value > 0 ? "+" : "") + value;
      return value;
    },
    // damage() {
    //   const value = this.ability ? this.ability.damage : null;

    //   if (!value) {
    //     return null;
    //   }

    //   return "damage: " + (value > 0 ? "+" : "") + value;
    // },
    // defence() {
    //   const value = this.ability ? this.ability.defence : null;

    //   if (!value) {
    //     return null;
    //   }

    //   return "defence: " + (value > 0 ? "+" : "-") + value;
    // },
    // speed() {
    //   const value = this.ability ? this.ability.speed : null;

    //   if (!value) {
    //     return null;
    //   }

    //   return "speed: " + (value > 0 ? "+" : "-") + value;
    // },
    description() {
      const items = [];

      if (this.name) {
        items.push(this.$t("battle-ability-" + this.name));
      }
      if (this.level) {
        items.push(this.level);
      }
      if (this.value) {
        items.push(this.value);
      }
      // if (this.damage) {
      //   items.push(this.damage);
      // }
      // if (this.defence) {
      //   items.push(this.defence);
      // }
      // if (this.speed) {
      //   items.push(this.speed);
      // }

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
        ability: this.ability.abilityClass
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
