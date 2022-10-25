<template>
  <div v-if="unit" class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <div class="screen-content">
        <BattleUserBalance
          class="width-100 flex flex-center padding-top-1 padding-bottom-1 relative"
        />
        <div class="font-size-22 height-100 padding-2">
          <div>

            <div class="flex flex-no-wrap flex-center margin-top-1">
              <div>
                <BattleUnit :unit="unit" />
              </div>
              <div class="margin-left-2">
                <div
                  class="text-align-left font-weight-700 font-shadow"
                  :class="'battle-unit-tribe--' + unit.tier"
                >
                  <div>
                    {{ $t("battle-unit-tribe-" + unit.tribe) }}
                    {{ $t("battle-unit-class-" + unit.class) }}
                  </div>
                </div>
                <div class="flex flex-no-wrap">
                  <div class="text-align-left">
                    <div>Tier: {{ unit.tier }}</div>
                    <div>Level: {{ level }}</div>
                    <div v-if="unit.characteristics.hp">
                      Hp: {{ unit.characteristics.hp }}
                    </div>
                    <div>Power: {{ unit.power }}</div>
                  </div>
                  <div class="text-align-left margin-left-2">
                    <div>Attack: {{ unit.characteristics.damage }}</div>
                    <div>Defence: {{ unit.characteristics.defence }}</div>
                    <div>Speed: {{ unit.characteristics.speed }}</div>
                    <div>Initiative: {{ unit.characteristics.initiative }}</div>
                  </div>
                </div>
              </div>
            </div>
            <!--  -->
            <div class="flex margin-top-2">
              <div v-if="maxLevelReached" class="width-100 text-align-center">
                <div>Max level reached!</div>
                <div v-if="unit.tier === 1">Tier 1: 15 lvl Max</div>
                <div v-if="unit.tier === 2">Tier 2: 30 lvl Max</div>
                <div v-if="unit.tier === 3">Tier 3: 45 lvl Max</div>
              </div>
              <template v-else>
                <div class="padding-right-1">Exp:</div>
                <ProgressBar
                  :value="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="expMaxValue"
                ></ProgressBar>
              </template>
            </div>
            <div v-if="true">
              <template v-if="!maxLevelReached">
                <CustomButton
                  v-if="true"
                  type="blue"
                  class="inline-block margin-right-2 margin-top-1"
                  @click="increaseHandler(100)"
                >
                  +100 exp
                </CustomButton>
                <CustomButton
                  v-if="true"
                  type="blue"
                  class="inline-block margin-right-2 margin-top-1"
                  @click="increaseHandler(500)"
                >
                  +500 exp
                </CustomButton>
                <CustomButton
                  v-if="true"
                  type="blue"
                  class="inline-block margin-right-2 margin-top-1"
                  @click="increaseHandler(5000)"
                >
                  +5000 exp
                </CustomButton>
                <!--CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-1"
                @click="decreaseHandler"
              >
                {{ $t("exp-") }}
              </CustomButton-->
              </template>
            </div>
            <div class="text-align-center">
              <CustomButton
                v-if="canUpgrade"
                :disabled="!isEnoughCoinsToUpgradeLevel"
                type="green"
                class="inline-block margin-right-2 margin-top-1"
                @click="upgradeLevelHandler(upgradePrice)"
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
                <BattleCoin class="margin-left-1" :value="upgradePrice" />
              </CustomButton>
            </div>
            <div class="margin-top-3 padding-bottom-2">
              <div class="margin-bottom-1">Abilities</div>
              <BattleUnitAbilityDetails
                v-for="(ability, index) in abilities"
                :key="ability.abilityType + ability.abilityClass"
                :unit="unit"
                :ability="ability"
                :shouldUseCombatValue="true"
                :class="{ 'margin-top-2': index > 0 }"
              >
              </BattleUnitAbilityDetails>
            </div>
          </div>
        </div>
      </div>
    </div>

    <portal to="footer" :slim="true" v-if="false && isActive">
      <CustomButton type="grey">{{ $t("btn-filter") }}</CustomButton>
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleLevelUpConfirm from "@/views/Battle/BattleLevelUpConfirm.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
// import BattleUnitList from "@/views/Battle/BattleUnitList.vue";
// import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
import BattleUnitAbilityDetails from "@/views/Battle/BattleUnitAbilityDetails.vue";
import BattleCoin from "@/views/Battle/BattleCoin.vue";
import BattleUserBalance from "@/views/Battle/BattleUserBalance.vue";
// import BattleCrystal from "@/views/Battle/BattleCrystal.vue";
// import BattleMixin from "@/views/Battle/BattleMixin.vue";

export default {
  mixins: [
    AppSection,
    NetworkRequestErrorMixin,
    ActivityMixin
    //BattleMixin
  ],
  components: {
    BattleUnit,
    // BattleUnitAbility,
    BattleUnitAbilityDetails,
    BattleCoin,
    BattleUserBalance
    // BattleCrystal
  },
  data() {
    return {
      // expValue: 0,
      // unit: null
    };
  },
  computed: {
    ...mapState("battle", ["inventory", "user"]),
    unit() {
      if (this.inventory) {
        return this.inventory.find(item => {
          return item.unitId === this.$route.params.id;
        });
      }

      return null;
    },
    damage() {
      if (!this.unit) {
        return 0;
      }
      const attackAbility = this.unit.abilities.find(
        ({ abilityClass }) => abilityClass === "attack"
      );
      if (attackAbility) {
        return Math.round(attackAbility.combatValue * 100) / 100;
      }
      return this.unit.characteristics.damage;
    },
    nextLevel() {
      return this.unit && this.unit.level ? this.unit.level.next : null;
    },
    canUpgrade() {
      return this.nextLevel;
    },
    isEnoughCoinsToUpgradeLevel() {
      return (
        this.upgradePrice &&
        this.user &&
        this.user.balance &&
        this.user.balance.coins >= this.upgradePrice
      );
    },
    upgradePrice() {
      return this.unit && this.unit.level ? this.unit.level.price : null;
    },
    expValue() {
      return this.unit && this.unit.expirience
        ? this.unit.expirience.currentLevelExp || 0
        : 0;
    },
    maxLevelReached() {
      return this.unit && this.unit.expirience.maxLevelReached;
    },
    expMaxValue() {
      const next =
        this.unit && this.unit.expirience
          ? this.unit.expirience.nextLevelExp || 0
          : 0;
      return next;
    },
    abilities() {
      return this.unit && this.unit.abilities ? this.unit.abilities : [];
    },
    level() {
      return this.unit && this.unit.level ? this.unit.level.current : "";
    }
  },
  activated() {
    this.title = this.unit ? this.unit.name : "unit details";
  },
  methods: {
    handleBackButton() {
      this.$router.replace({ name: "battle-units" });
      return true;
    },
    async upgradeLevelHandler(price) {
      const show = create(BattleLevelUpConfirm, "type", "value");
      const result = await show("", price);

      if (!result) {
        return;
      }

      this.$store.dispatch("battle/upgradeUnitLevel", {
        unitId: this.unit.unitId
      });
    },
    increaseHandler(exp) {
      this.$store.dispatch("battle/testAction", {
        action: "increaseUnitExp",
        unitTemplate: this.unit.template,
        exp
      });
    },
    decreaseHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "decreaseUnitExp",
        unitId: this.$route.params.id
      });
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit {
  width: 100px;
  margin: 0 auto;
}
.battle-squad-unit-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
.col-span-2 {
  grid-column: span 2 / span 2;
}
::v-deep .ability-value {
  display: none;
}
.battle-unit-tribe--1 {
  color: #70ee70;
}
.battle-unit-tribe--2 {
  color: #38bdf8;
}
.battle-unit-tribe--3 {
  color: #c965ee;
}
</style>
