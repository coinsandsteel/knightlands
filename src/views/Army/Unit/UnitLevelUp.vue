<template>
  <div class="screen-content" v-if="unit">
    <div class="color-panel-2 stats-grid font-size-18">
      <span class="left">{{$t("unit-dmg", { dmg: damage })}}</span>
      <span class="right-arrow"></span>
      <span class="right">{{$t("unit-dmg", { dmg: nextDamage })}}</span>

      <span class="left">{{$t("unit-lvl", { lvl: level })}}</span>
      <span class="right-arrow"></span>
      <span class="right">{{$t("unit-lvl", { lvl: level + 1 })}}</span>
    </div>

    <HorizontalItemQuantity ref="ingridients" class="padding-top-2" :items="levelingItems">
      <CustomButton :disabled="!enoughIngridients" type="green" class="width-30" @click="levelUp">{{$t("unit-lvl-up")}}</CustomButton>
    </HorizontalItemQuantity>
  </div>
</template>

<script>
import UnitGetterMixin from "../UnitGetterMixin.vue";
import HorizontalItemQuantity from "@/components/HorizontalItemQuantity.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CustomButton from "@/components/Button.vue";
import TroopsMeta from "@/troops_meta";
import GeneralsMeta from "@/generals_meta";

export default {
  mixins: [UnitGetterMixin, PromptMixin],
  props: ["unit"],
  data: () => ({
    enoughIngridients: true
  }),
  components: {
    HorizontalItemQuantity,
    CustomButton
  },
  watch: {
    unit: {
      immediate: true,
      handler() {
        this.updateEnoughIngridients();
      }
    }
  },
  computed: {
    meta() {
      let meta = GeneralsMeta;
      if (this.unit.troop) {
        meta = TroopsMeta;
      }
      return meta;
    },
    isMaxLevel() {
      return this.level <= this.maxLevel;
    },
    levelingItems() {
      let items = [];
      let levelRecord = this.meta.leveling.levelingSteps[this.level - 1];
      items.push({
        item: this.meta.essenceItem,
        quantity: levelRecord.essence
      });
      items.push({ item: this.meta.goldItem, quantity: levelRecord.gold });
      return items;
    },
    nextPower() {
      let levelRecord = this.meta.leveling.levelingSteps[this.level - 1];
      return levelRecord.power;
    }
  },
  methods: {
    async levelUp() {
      const newUnitData = await this.$game.levelUpUnit(this.unit.id);
      this.$game.army.getUnit(this.unit.id).level = newUnitData.level;
      this.updateEnoughIngridients();
    },
    updateEnoughIngridients() {
      if (!this.$refs.ingridients) {
        this.enoughIngridients = false;
      } else {
        this.enoughIngridients = this.$refs.ingridients.enoughItems;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 4rem 1fr;
  grid-auto-rows: 3rem;
  align-items: center;
  justify-items: center;

  & .left {
    justify-self: end;
  }

  & .right {
    justify-self: start;
  }
}
</style>
