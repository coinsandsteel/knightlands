<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div class="width-100 height-100 grid">
      <div class="flex flex-center from-title">
        <span class="font-size-20">{{$t("from-unit")}}</span>
      </div>
      <div class="flex flex-center to-title">
        <span class="font-size-20">{{$t("to-unit")}}</span>
      </div>
      <UnitSlot :unit="fromUnit" class="from-unit width-90" @click="selectFromUnit" />
      <span class="arrow"></span>
      <UnitSlot :unit="toUnit" class="to-unit width-90" @click="selectToUnit" />

      <div class="flex flex-column font-size-20 from-abilities">
        <span
          class="flex flex-center margin-top-1"
          v-for="ability in fromAbilities"
          :key="ability.id"
          v-html="getAbilityDesc(ability, fromUnit)"
        ></span>
      </div>

      <div class="flex flex-column font-size-20 to-abilities">
        <span
          class="flex flex-center margin-top-1"
          v-for="ability in toAbilities"
          :key="ability.id"
          v-html="getAbilityDesc(ability, toUnit)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import UnitSlot from "../UnitSlot.vue";
import UnitGetterMixin from "../UnitGetterMixin.vue";

export default {
  mixins: [AppSection, UnitGetterMixin],
  props: ["fromUnit", "toUnit"],
  components: { UnitSlot },
  created() {
    this.$options.useRouterBack = true;
    this.title = "window-ability-transfer";
  },
  watch: {
    fromUnit() {
      if (!this.fromUnit || !this.toUnit) {
        return;
      }

      if (
        this.fromUnit.template != this.toUnit.template ||
        this.fromUnit.id == this.toUnit.id
      ) {
        this.$emit("resetToUnit");
      }
    }
  },
  computed: {
    fromAbilities() {
      if (!this.fromUnit) {
        return [];
      }
      return [2740, 2740, 2740].map(x=>this.$game.armyDB.getAbility(x, this.fromUnit.troop));
    },
    toAbilities() {
      if (!this.toUnit) {
        return [];
      }
      return this.$game.armyDB.getAbilities(this.toUnit);
    }
  },
  methods: {
    selectFromUnit() {
      this.$router.push({
        name: "ability-transfer-select",
        params: { from: true }
      });
    },
    selectToUnit() {
      let excludeUnit;
      if (this.fromUnit) {
        excludeUnit = this.fromUnit;
      }
      this.$router.push({
        name: "ability-transfer-select",
        params: { from: false, excludeUnit }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 5% 1fr;
  grid-template-rows: 4rem minmax(25rem, 30vh) 1fr;
  justify-items: center;

  & .from-title {
    grid-column: 1;
    grid-row: 1;
  }

  & .to-title {
    grid-column: 3;
    grid-row: 1;
  }

  & .from-unit {
    grid-column: 1;
    grid-row: 2;
  }

  & .arrow {
    grid-column: 2;
    grid-row: 2;
  }

  & .to-unit {
    grid-column: 3;
    grid-row: 2;
  }

  & .from-abilities {
    grid-column: 1;
    grid-row: 3;
  }

  & .to-abilities {
    grid-column: 3;
    grid-row: 3;
  }
}
</style>
