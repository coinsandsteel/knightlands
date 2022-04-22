<template>
  <Promised class="screen-content" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>
      <SoundEffect ref="fx" :files="['unit_promo']" channel="stinger" />
      <div v-bar>
        <div class="dummy-height">
          <template v-if="!isAtMaxStars">
            <div class="color-panel-2 stats-grid font-size-20">
              <IconWithValue iconClass="icon-damage" class="left">{{
                damage
              }}</IconWithValue>
              <span class="right-arrow"></span>
              <IconWithValue iconClass="icon-damage" class="right">{{
                nextPromotionDamage
              }}</IconWithValue>

              <span class="left">{{
                $t("unit-max-lv", { lvl: maxLevel })
              }}</span>
              <span class="right-arrow"></span>
              <span class="right">{{
                $t("unit-max-lv", { lvl: nextMaxLevel })
              }}</span>

              <UnitStars :stars="stars" class="left"></UnitStars>
              <span class="right-arrow"></span>
              <UnitStars :stars="starsNext" class="right"></UnitStars>
            </div>

            <div class="margin-top-1 flex flex-center">
              <UnitIngridient
                v-for="(ingr, idx) in ingridients"
                :key="idx"
                :ingridient="ingr"
                :unit="unit"
                :current="getCurrent(ingr.id)"
                @click="selectUnits(unit, ingr)"
              />
            </div>

            <CraftingIngridient
              class="padding-top-2"
              :ingridient="soulsIngridient"
            />

            <div class="flex flex-center margin-bottom-1 margin-top-2">
              <span class="font-size-20">{{ $t("du-balance") }}</span>

              <IconWithValue class="balance" iconClass="icon-dkt2">{{
                $game.dkt
              }}</IconWithValue>
            </div>

            <div class="flex flex-center margin-top-1">
              <CustomButton
                type="yellow"
                @click="promote"
                :disabled="!(canPromote && readyToPromote)"
              >
                <div class="flex flex-center">
                  <span class="margin-right-1">{{ $t("btn-promote") }}</span>
                  <AshTag :price="recipe.price" v-model="ashPrice"> </AshTag>
                </div>
              </CustomButton>
            </div>

            <div class="flex flex-center margin-top-2" v-if="!readyToPromote">
              <span class="rarity-mythical font-size-25">{{
                $t("unit-lvl-req", { level: maxLevel })
              }}</span>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-center margin-top-4">
              <span class="rarity-rare font-size-25">{{
                $t("unit-max-lvl")
              }}</span>
            </div>
          </template>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import { Promised } from "vue-promised";
import SoundEffect from "@/components/SoundEffect.vue";
import UnitIngridient from "./UnitIngridient.vue";
import UnitStars from "../UnitStars.vue";
import UnitGetterMixin from "../UnitGetterMixin.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CustomButton from "@/components/Button.vue";
import TroopsMeta from "@/metadata/troops_meta";
import GeneralsMeta from "@/metadata/generals_meta";
import ArmyMeta from "@/metadata/army_meta";
import IconWithValue from "@/components/IconWithValue.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AshTag from "@/components/AshTag.vue";

import { create as createDialog } from "vue-modal-dialogs";
import ArmyIngridientSelector from "./ArmyIngridientSelector.vue";

const UnitSelector = createDialog(
  ArmyIngridientSelector,
  "unit",
  "ingridient",
  "usedUnits"
);

export default {
  mixins: [UnitGetterMixin, PromptMixin, NetworkRequestErrorMixin],
  props: ["unit"],
  data: () => ({
    ingridients: [],
    request: null,
    unitsPerIngridient: {},
    selectedUnits: {},
    ashPrice: 0
  }),
  components: {
    AshTag,
    SoundEffect,
    UnitStars,
    UnitIngridient,
    CraftingIngridient,
    CustomButton,
    IconWithValue,
    Promised,
    LoadingScreen
  },
  watch: {
    unit: {
      immediate: true,
      handler() {
        let recipe = this.recipe;
        if (!recipe) {
          return;
        }

        this.ingridients = [];

        for (const ingrd of recipe.ingridients) {
          this.ingridients.push({ ...ingrd });
        }

        this.selectedUnits = {};
        this.unitsPerIngridient = {};
      }
    }
  },
  computed: {
    starsNext() {
      if (!this.isAtMaxStars) {
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
    isAtMaxStars() {
      return this.stars == this.maxStars;
    },
    soulsRequired() {
      return this.recipe.souls;
    },
    readyToPromote() {
      return this.level == this.maxLevel;
    },
    soulsIngridient() {
      return { itemId: this.soulsItem, quantity: this.soulsRequired };
    },
    canPromote() {
      for (const ingr of this.ingridients) {
        const units = this.unitsPerIngridient[ingr.id];
        if (!units || units.length != ingr.amount) {
          return false;
        }
      }

      return this.$game.inventory.hasEnoughIngridient(this.soulsIngridient);
    }
  },
  methods: {
    clearSelectedUnits(ingridient) {
      const units = this.unitsPerIngridient[ingridient.id];
      if (!units) {
        return;
      }
      for (const unit of units) {
        this.$delete(this.selectedUnits, unit.id);
      }
    },
    getCurrent(ingrId) {
      if (!this.unitsPerIngridient[ingrId]) {
        return 0;
      }
      return this.unitsPerIngridient[ingrId].length;
    },
    async selectUnits(unit, ingridient) {
      this.clearSelectedUnits(ingridient);
      this.$delete(this.unitsPerIngridient, ingridient.id);

      const units = await UnitSelector(unit, ingridient, this.selectedUnits);

      if (units) {
        this.$set(this.unitsPerIngridient, ingridient.id, units);
        for (const unit of units) {
          this.$set(this.selectedUnits, unit.id, unit);
        }
      }
    },
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
        const units = {};
        for (const ingridientId in this.unitsPerIngridient) {
          units[ingridientId] = this.unitsPerIngridient[ingridientId].map(
            x => x.id
          );
        }

        this.request = this.performRequest(
          this.$game.promoteUnit(this.unit.id, units)
        );

        try {
          await this.request;
          this.$refs.fx.play();
          this.unitsPerIngridient = {};
          this.selectedUnits = {};
        } catch {}
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
