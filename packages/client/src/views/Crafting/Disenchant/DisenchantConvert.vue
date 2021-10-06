<template>
  <Promised class="screen-content" :promise="request">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>
      <div class="screen-background"></div>

      <div v-bar>
        <div>
          <Title class="margin-top-1 margin-bottom-3">{{
            $t("dis-from-title")
          }}</Title>

          <div class="flex flex-center">
            <Loot
              v-for="material in materialsInPosession"
              :key="material.id"
              :item="material"
            ></Loot>
          </div>

          <Title class="margin-top-5 margin-bottom-3">{{
            $t("dis-convert-title")
          }}</Title>

          <div class="flex flex-column">
            <MaterialConverterElement
              class="margin-bottom-4"
              ref="converters"
              v-for="material in materialsForConversion"
              :key="material.rarity"
              :id="material.rarity"
              :itemFrom="material.from"
              :itemTo="material.to"
              :conversionRate="material.upgradeCost"
              @changed="handleConversion"
              @hint="handleHint"
            ></MaterialConverterElement>
          </div>

          <div class="flex flex-center margin-top-1">
            <CustomButton
              type="yellow"
              :disabled="!canConvert"
              @click="convert"
              >{{ $t("btn-dis-convert") }}</CustomButton
            >
          </div>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import AppSection from "@/AppSection.vue";
import { Promised } from "vue-promised";
import PromptMixin from "@/components/PromptMixin.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import DisenchantingMeta from "@/disenchanting_meta";
import CustomButton from "@/components/Button.vue";
import Rarity from "@/../../knightlands-shared/rarity";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";
import HintHandler from "@/components/HintHandler.vue";
import Loot from "@/components/Loot.vue";
import MaterialConverterElement from "./MaterialConverterElement.vue";
import Title from "@/components/Title.vue";

export default {
  mixins: [AppSection, ShowItemsMixin, HintHandler, PromptMixin],
  components: {
    Promised,
    LoadingScreen,
    MaterialConverterElement,
    CustomButton,
    Loot,
    Title
  },
  data: () => ({
    request: null,
    conversions: {},
    DisenchantingMeta
  }),
  created() {
    this.title = "window-dis-convert";
  },
  computed: {
    materialsForConversion() {
      let materials = [];
      for (const rarity in DisenchantingMeta) {
        let upgradeCost = DisenchantingMeta[rarity].upgradeCost;
        if (upgradeCost == 0) {
          continue;
        }

        materials.push({
          rarity,
          from: DisenchantingMeta[rarity].dustItem,
          to: DisenchantingMeta[this.nextRarity(rarity)].dustItem,
          upgradeCost
        });
      }

      return materials;
    },
    canConvert() {
      return Object.keys(this.conversions).length > 0;
    },
    materialsInPosession() {
      let materials = [];
      for (const rarity in DisenchantingMeta) {
        let item = this.$game.inventory.getItemByTemplate(
          DisenchantingMeta[rarity].dustItem
        );
        if (item.id != -1) {
          materials.push(item);
        }
      }
      return materials;
    }
  },
  methods: {
    async convert() {
      try {
        let payload = {};

        for (const rarity in this.conversions) {
          let item = this.$game.inventory.getItemByTemplate(
            DisenchantingMeta[rarity].dustItem
          );
          payload[item.id] = this.conversions[rarity];
        }

        this.request = this.$game.disenchantConvert(payload);
        const items = await this.request;

        this.conversions = {};
        for (const c of this.$refs.converters) {
          c.reset();
        }

        await this.showItems(items);
      } catch {
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("prompt-snap-msg"),
          [
            {
              type: "yellow",
              title: "btn-ok",
              response: true
            }
          ]
        );
      }
    },
    handleConversion(count, rarity) {
      if (count == 0) {
        this.$delete(this.conversions, rarity);
      } else {
        this.$set(this.conversions, rarity, 0);
        this.conversions[rarity] = count;
      }
    },
    nextRarity(rarity) {
      switch (rarity) {
        case Rarity.Common:
          return Rarity.Rare;
        case Rarity.Rare:
          return Rarity.Epic;
        case Rarity.Epic:
          return Rarity.Legendary;
        case Rarity.Legendary:
          return Rarity.Mythical;
        default:
          return null;
      }
    }
  }
};
</script>
