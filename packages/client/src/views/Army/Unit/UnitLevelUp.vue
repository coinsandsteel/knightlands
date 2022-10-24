<template>
  <div class="screen-content" v-if="unit">
    <div class="color-panel-2 stats-grid font-size-20">
      <IconWithValue iconClass="icon-damage" class="left">{{
        damage
      }}</IconWithValue>
      <span class="right-arrow"></span>
      <span class="right rarity-mythical" v-if="isMaxLevel">{{
        $t("max-lv")
      }}</span>
      <IconWithValue iconClass="icon-damage" class="right" v-else>{{
        nextDamage
      }}</IconWithValue>

      <span class="left">{{ $t("unit-lvl", { lvl: level }) }}</span>
      <span class="right-arrow"></span>
      <span class="right rarity-mythical" v-if="isMaxLevel">{{
        $t("max-lv")
      }}</span>
      <span class="right" v-else>{{ $t("unit-lvl", { lvl: level + 1 }) }}</span>
    </div>

    <div class="flex flex-column margin-top-1 width-100 flex-center">
      <CraftingIngridient :ingridient="levelItem" ref="levelIngridient" />

      <PurchaseButton
        class="margin-top-1"
        :disabled="!canLevel()"
        type="green"
        :price="goldPrice"
        :soft="true"
        @click="levelUp"
      >
        {{ $t("unit-lvl-up") }}
      </PurchaseButton>
      <span
        v-if="!meetLvlRequirement && !maxPossibleLevel"
        class="font-error font-size-20 font-weight-900 margin-top-1"
        >{{ $t("ch-lvl-req", { level: level + 1 }) }}</span
      >
    </div>

    <SoundEffect ref="fx" :files="['unit_lvl_up']" channel="fx" />
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import UnitGetterMixin from "../UnitGetterMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import TroopsMeta from "@/metadata/troops_meta";
import GeneralsMeta from "@/metadata/generals_meta";
import IconWithValue from "@/components/IconWithValue.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";

export default {
  mixins: [UnitGetterMixin, PromptMixin],
  props: ["unit"],
  data: () => ({
    ready: false
  }),
  components: {
    SoundEffect,
    PurchaseButton,
    IconWithValue,
    CraftingIngridient
  },
  mounted() {
    this.ready = true;
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
      return this.level >= this.maxLevel;
    },
    resources() {
      return [this.meta.essenceItem, this.meta.goldItem];
    },
    goldPrice() {
      return this.meta.leveling.levelingSteps[this.level - 1].gold;
    },
    levelItem() {
      let levelRecord = this.meta.leveling.levelingSteps[this.level - 1];
      return {
        itemId: this.meta.essenceItem,
        quantity: levelRecord.essence
      };
    },
    nextPower() {
      let levelRecord = this.meta.leveling.levelingSteps[this.level - 1];
      return levelRecord.power;
    },
    meetLvlRequirement() {
      return (
        this.level < this.$game.character.level ||
        this.$game.character.level == 200
      );
    }
  },
  methods: {
    canLevel() {
      if (!this.ready) {
        return false;
      }
      if (this.isMaxLevel) {
        return false;
      }
      if (!this.meetLvlRequirement) {
        return false;
      }
      return !this.$refs.levelIngridient.notEnoughMaterials;
    },
    async levelUp() {
      await this.$game.levelUpUnit(this.unit.id);
      this.$refs.fx.play();
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
