<template>
  <div v-if="unit" class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <div class="screen-content ">
        <div class="font-size-22 height-100 padding-left-2 padding-right-2">
          <div>
            <div class="margin-top-2">
              <BattleUnit :unit="unit" />
            </div>
            <div class="margin-top-1 font-size-30">
              # {{ unit.unitTribe }} {{ unit.unitClass }} #
            </div>
            <div class="margin-top-2">Tier: {{ unit.tier }}</div>
            <div>
              Level: {{ level }}
              <CustomButton
                v-if="canUpgrade"
                :disabled="!isEnoughCoinsToUpgradeLevel"
                type="green"
                class="inline-block margin-right-2 margin-top-1"
                @click="upgradeLevelHandler"
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
            <div class="flex margin-top-2">
              <div class="padding-right-1">Exp:</div>
              <ProgressBar
                :value="expValue"
                :expand="false"
                height="2rem"
                class="full-flex"
                barType="green"
                :maxValue="expMaxValue"
                @refill="upgradeLevelHandler"
              ></ProgressBar>
            </div>
            <div>
              <CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-1"
                @click="increaseHandler"
              >
                {{ $t("exp+") }}
              </CustomButton>
              <!--CustomButton
                type="blue"
                class="inline-block margin-right-2 margin-top-1"
                @click="decreaseHandler"
              >
                {{ $t("exp-") }}
              </CustomButton-->
            </div>
            <div class="margin-top-2">
              <div>Hp - {{ unit.characteristics.hp }}</div>
              <div>Defense - {{ unit.characteristics.damage }}</div>
              <div>Damage - {{ unit.characteristics.defence }}</div>
              <div>Speed - {{ unit.characteristics.initiative }}</div>
              <div>Initiative - {{ unit.characteristics.speed }}</div>
            </div>
            <div class="margin-top-3">
              <div>Abilities</div>
              <BattleUnitAbilityDetails
                v-for="(ability, index) in abilities"
                :key="ability.abilityType + ability.abilityClass"
                :unit="unit"
                :ability="ability"
                :class="{ 'margin-top-2': index > 0 }"
              >
                <!-- <div class="padding-right-1">
                  <BattleUnitAbility :ability="ability" />
                </div>
                <ProgressBar
                  :value="ability.level || 0"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="4"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar> -->
              </BattleUnitAbilityDetails>
            </div>
            <!-- <div class="battle-squad-unit-info font-size-22 text-align-left">
              <div>
                Ability 1
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div>
                Ability 2
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div>Defense - 3</div>
              <div>
                Ability 3
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
              <div>Speed - 14</div>
              <div></div>
              <div>Initiative - 14</div>
              <div></div>
              <div class="col-span-2">
                Exp:
                <ProgressBar
                  v-model="expValue"
                  :expand="false"
                  height="2rem"
                  class="full-flex"
                  barType="green"
                  :maxValue="10"
                  :plusButton="'green'"
                  @refill="refillHandler"
                ></ProgressBar>
              </div>
            </div> -->
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
    BattleUnitAbilityDetails
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
  created() {
    this.title = this.$t("battle-unit");
  },
  methods: {
    handleBackButton() {
      this.$router.replace({ name: "battle-units" });
      return true;
    },
    async upgradeLevelHandler() {
      // const show = create(BattleLevelUpConfirm);
      // await show();
      this.$store.dispatch("battle/upgradeUnitLevel", {
        unitId: this.unit.unitId
      });
    },
    increaseHandler() {
      this.$store.dispatch("battle/testAction", {
        action: "increaseUnitExp",
        unitId: this.$route.params.id
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
</style>
