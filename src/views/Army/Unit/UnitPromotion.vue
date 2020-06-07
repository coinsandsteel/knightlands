<template>
  <div class="screen-content">
    <div class="color-panel-2 stats-grid font-size-18">
      <span class="left">Damage 9999</span>
      <span class="right-arrow"></span>
      <span class="right">Damage 99999</span>

      <span class="left">{{$t("unit-max-lv", { lvl: maxLevel })}}</span>
      <span class="right-arrow"></span>
      <span class="right">{{$t("unit-max-lv", { lvl: nextMaxLevel })}}</span>

      <UnitStars :stars="stars" class="left"></UnitStars>
      <span class="right-arrow"></span>
      <UnitStars :stars="starsNext" class="right"></UnitStars>
    </div>

    <div class="color-panel-2 flex flex-center">
      <UnitIngridient
        v-for="(ingr, idx) in ingridients"
        :key="idx"
        :ingridient="ingr"
        :unit="unit"
      />
      <UnitIngridient
        v-for="(ingr, idx) in ingridients"
        :key="idx"
        :ingridient="ingr"
        :unit="unit"
      />
    </div>

    <HorizontalItemQuantity
      class="padding-top-2"
      :items="[{item: soulsItem, quantity: soulsRequired}]"
    >
      <CustomButton type="green" class="width-30" @click="promote">Promote</CustomButton>
    </HorizontalItemQuantity>
  </div>
</template>

<script>
import UnitIngridient from "./UnitIngridient.vue";
import UnitStars from "../UnitStars.vue";
import UnitGetterMixin from "../UnitGetterMixin.vue";
import HorizontalItemQuantity from "@/components/HorizontalItemQuantity.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CustomButton from "@/components/Button.vue";
import TroopsMeta from "@/troops_meta";
import GeneralsMeta from "@/generals_meta";
import ArmyMeta from "@/army_meta";

export default {
  mixins: [UnitGetterMixin, PromptMixin],
  props: ["unit"],
  data: () => ({
    ingridients: []
  }),
  components: {
    UnitStars,
    UnitIngridient,
    HorizontalItemQuantity,
    CustomButton
  },
  watch: {
    unit: {
      immediate: true,
      handler() {
        let recipe = this.recipe;
        for (const ingrd of recipe.ingridients) {
          this.ingridients.push({ ...ingrd });
        }
      }
    }
  },
  computed: {
    starsNext() {
      if (this.stars < 10) {
        return this.stars + 1;
      }

      return this.stars;
    },
    meta() {
      let meta = GeneralsMeta;
      if (this.unit.troop) {
        meta = TroopsMeta;
      }
      return meta.fusionMeta;
    },
    recipe() {
      let template = this.meta.templates.find(t => t.stars == this.stars + 1);
      return template;
    },
    soulsItem() {
      return ArmyMeta.soulsItem;
    },
    soulsRequired() {
      return this.recipe.price;
    }
  },
  methods: {
    async promote() {
      let confirmation = await this.showPrompt(
        this.$t("promo-title"),
        this.$t("promo-desc"),
        [
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          },
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: true
          }
        ]
      );

      if (confirmation === true) {
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
