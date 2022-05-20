<template>
  <div v-if="unit" class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <div class="screen-content ">
        <div class="font-size-22 height-100">
          <div>
            <div>
              <BattleUnit :unit="unit" />
            </div>
            <div>Tier: {{ unit.tier }}</div>
            <div>Level: {{ unit.level }}</div>
            <div class="flex">
              <div>Exp:</div>
              <ProgressBar
                :value="expValue"
                :expand="false"
                height="2rem"
                class="full-flex"
                barType="green"
                :maxValue="expMaxValue"
                :plusButton="'green'"
                @refill="refillHandler"
              ></ProgressBar>
            </div>
            <div>
              <div>Hp - {{ unit.characteristics.hp }}</div>
              <div>Defense - {{ unit.characteristics.damage }}</div>
              <div>Damage - {{ unit.characteristics.defence }}</div>
              <div>Speed - {{ unit.characteristics.initiative }}</div>
              <div>Initiative - {{ unit.characteristics.speed }}</div>
            </div>
            <div>
              <div
                v-for="ability in abilities"
                :key="ability.abilityGroup + ability.abilityClass"
                class="flex"
              >
                <div class="padding-right-1">
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
                ></ProgressBar>
              </div>
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
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, ActivityMixin],
  components: {
    BattleUnit,
    BattleUnitAbility
  },
  data() {
    return {
      // expValue: 0,
      unit: null
    };
  },
  computed: {
    ...mapState("battle", ["inventory"]),
    expValue() {
      return this.unit && this.unit.experience
        ? this.unit.experience.current || 0
        : 0;
    },
    expMaxValue() {
      return this.unit && this.unit.experience
        ? this.unit.experience.max || 0
        : 0;
    },
    abilities() {
      return this.unit && this.unit.abilities ? this.unit.abilities : [];
    }
  },
  created() {
    this.title = this.$t("battle-unit");
    if (this.inventory) {
      this.unit = this.inventory.find(item => {
        return item.unitId === this.$route.params.id;
      });
    }
  },
  methods: {
    handleBackButton() {
      console.log("handleBackButton 123");
      this.$router.replace({ name: "battle-units" });
      return true;
    },
    async refillHandler() {
      const show = create(BattleLevelUpConfirm);
      await show();
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
