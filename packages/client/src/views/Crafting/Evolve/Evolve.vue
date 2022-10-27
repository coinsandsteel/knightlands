<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="margin-top-2 flex flex-items-center flex-space-evenly">
      <Loot
        :item="baseItem"
        :showUnbindLevels="true"
        :showLevel="true"
        :showEquipped="false"
        :hideQuantity="true"
        :showUnique="false"
        @hint="handleHint"
      ></Loot>
      <span class="nav-arrow"></span>
      <Loot
        :item="nextItem"
        :showUnbindLevels="true"
        :showLevel="true"
        :showEquipped="false"
        :hideQuantity="true"
        :showUnique="false"
        @hint="handleHint"
      ></Loot>
    </div>

    <ItemStatsUpgraded
      class="margin-top-2 color-panel-2"
      :item="baseItem"
      :nextLevel="baseItem.level"
      :nextRarity="nextRarity"
    ></ItemStatsUpgraded>

    <div class="width-100 flex flex-space-evenly margin-top-3">
      <ItemPicker
        v-if="isElemental"
        :item="nextItem"
        @select="selectItem"
        :filled="isFilled"
      />
      <CraftingIngridient
        v-for="ingridient in recipe.ingridients"
        :key="`${ingridient.itemId}_${ingridientsKey}`"
        :ingridient="ingridient"
      />
    </div>

    <div class="flex flex-column flex-center margin-top-3" v-if="isMaxLevel">
      <CustomButton
        :disabled="!canEvolve"
        type="yellow"
        v-if="recipe.softCurrencyFee > 0"
        @click="evolve"
      >
        <div class="flex flex-center">
          <span class="margin-right-1">{{ $t("btn-evolve") }}</span>
          <IconWithValue iconClass="icon-gold">{{
            recipe.softCurrencyFee
          }}</IconWithValue>
        </div>
      </CustomButton>

      <template v-else-if="recipe.hardCurrencyFee > 0">
        <div class="flex flex-center margin-bottom-1">
          <span class="font-size-20">{{ $t("du-balance") }}</span>

          <IconWithValue class="balance" iconClass="icon-dkt2">{{
            $game.dkt
          }}</IconWithValue>
        </div>

        <CustomButton :disabled="!canEvolve" type="yellow" @click="evolve">
          <div class="flex flex-center">
            <span class="margin-right-1">{{ $t("btn-evolve") }}</span>
            <AshTag :price="recipe.hardCurrencyFee" v-model="ashPrice">
            </AshTag>
          </div>
        </CustomButton>
      </template>
    </div>

    <div v-else class="flex flex-column flex-center margin-top-3 color-panel-1">
      <span class="font-error margin-bottom-1 font-size-22">{{
        $t("item-max-lvl", { lvl: maxLevel })
      }}</span>
      <CustomButton type="grey" @click="levelUp">{{
        $t("btn-level-up")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Loot from "@/components/Loot.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import ItemStatsUpgraded from "@/components/Item/ItemStatsUpgraded.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import HintHandler from "@/components/HintHandler.vue";
import ItemPicker from "../ItemPicker.vue";
import Rarity from "@/../../knightlands-shared/rarity";
import Elements from "@/../../knightlands-shared/elements";
import EvolveMeta from "@/metadata/evolve";
import AshTag from "@/components/AshTag.vue";

import ItemCreatedPopup from "../Create/ItemCreatedPopup.vue";
import { create } from "vue-modal-dialogs";

const ShowItemCreated = create(ItemCreatedPopup, "item", "amount");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, HintHandler],
  props: ["baseItemId"],
  components: {
    AshTag,
    Loot,
    ItemStatsUpgraded,
    CraftingIngridient,
    CustomButton,
    IconWithValue,
    ItemPicker
  },
  created() {
    this.$options.useRouterBack = true;
    this.title = "window-evolve";
  },
  mounted() {},
  data: () => ({
    ingridientsKey: 0,
    selectedBaseItem: null,
    ashPrice: 0
  }),
  computed: {
    isElemental() {
      return this.$game.itemsDB.getElement(this.baseItem) != Elements.Physical;
    },
    evolveRecipe() {
      return EvolveMeta.evolveRecipes.find(
        x => x.fromRarity == this.$game.itemsDB.getRarity(this.baseItem)
      );
    },
    recipe() {
      return this.$game.crafting.getRecipe(this.evolveRecipe.recipe);
    },
    baseItem() {
      return this.$game.inventory.getItem(this.baseItemId);
    },
    item() {
      return +this.$route.query.item;
    },
    isFilled() {
      if (!this.item) {
        return false;
      }

      const fillerItem = this.$game.inventory.getItem(this.item);
      if (!fillerItem) {
        return false;
      }

      return this.nextItem.template == fillerItem.template;
    },
    nextItem() {
      let nextItem = { ...this.baseItem };
      nextItem.rarity = this.nextRarity;
      nextItem.breakLimit = 0;
      nextItem.template = this.$game.itemsDB.getEvolvedTemplate(
        this.baseItem.template
      );
      return nextItem;
    },
    isMaxLevel() {
      if (!this.baseItem) {
        return false;
      }

      return this.baseItem.level >= this.maxLevel;
    },
    maxLevel() {
      if (!this.baseItem) {
        return 0;
      }

      return this.$game.itemsDB.getMaxLevel(this.baseItem, 2);
    },
    nextRarity() {
      let rarity = this.$game.itemsDB.getRarity(this.baseItem);
      switch (rarity) {
        case Rarity.Common:
          rarity = Rarity.Rare;
          break;
        case Rarity.Rare:
          rarity = Rarity.Epic;
          break;
        case Rarity.Epic:
          rarity = Rarity.Legendary;
          break;
        case Rarity.Legendary:
          rarity = Rarity.Mythical;
          break;
      }

      return rarity;
    },
    canEvolve() {
      let enoughCurrency =
        this.recipe.softCurrencyFee <= this.$game.softCurrency;
      if (this.recipe.hardCurrencyFee > 0) {
        enoughCurrency = this.ashPrice <= this.$game.dkt;
      }

      return (
        this.$game.crafting.hasEnoughResourcesForRecipe(this.recipe) &&
        enoughCurrency &&
        this.$game.itemsDB.getRarity(this.baseItem) != Rarity.Mythical &&
        !this.baseItem.locked &&
        !this.$game.itemsDB.isAccessory(this.baseItem)
      );
    }
  },
  methods: {
    async evolve() {
      const { item } = await this.performRequest(
        this.$game.evolveItem(this.baseItem.id, this.item)
      );

      await ShowItemCreated(item, 1);
    },
    levelUp() {
      if (this.baseItem.breakLimit != 2) {
        this.$router.push({
          name: "unbind-item",
          params: { itemId: this.baseItem.id }
        });
      } else {
        this.$router.push({
          name: "upgrade-item",
          params: { itemId: this.baseItem.id }
        });
      }
    },
    selectItem() {
      this.$router.push({
        name: "select-for-elem",
        params: {
          itemTemplate: this.nextItem.template,
          rarity: this.nextRarity
        },
        query: { returnTo: this.$route.fullPath }
      });
    }
  }
};
</script>
