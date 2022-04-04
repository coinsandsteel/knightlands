<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>
    <SoundEffect ref="fx" :files="['wep_created']" channel="fx" />

    <Title :stackBottom="true">Select base:</Title>

    <div class="color-panel-2">
      <div class="flex flex-space-evenly margin-top-1 margin-bottom-2">
        <Loot
          v-for="itemId in baseItems"
          :key="itemId"
          :item="itemId"
          :selected="itemId == selectedItemId"
          @hint="selectBaseItem(itemId)"
        />
      </div>

      <ItemStats :item="selectedItemId" />
    </div>

    <Title :stackTop="true" :stackBottom="true">{{ $t("s-ele") }}</Title>

    <div class="flex width-100 flex-space-evenly color-panel-1">
      <div class="selector" v-for="element in elements" :key="element">
        <input
          ref="stages"
          :id="element"
          type="radio"
          name="element"
          :value="element"
          v-model="selectedElement"
        />
        <label
          class="relative pointer"
          :for="element"
          :class="`icon-${element} huge`"
        >
          <div :class="{ 'selector-border': selectedElement == element }"></div>
        </label>
      </div>
    </div>

    <div
      class="width-100 flex flex-space-evenly flex-items-center margin-top-3"
    >
      <ItemPicker
        :item="selectedItemId"
        @select="selectItem"
        :filled="!!item"
      />
      <CraftingIngridient
        v-for="ingridient in ingridients"
        :key="`${ingridient.itemId}_${ingridientsKey}`"
        :ingridient="ingridient"
      />
    </div>

    <div class="flex flex-column flex-center margin-top-3">
      <CustomButton
        :disabled="!canCraft"
        type="yellow"
        v-if="recipe.softCurrencyFee > 0"
        @click="craft"
      >
        <div class="flex flex-center">
          <span class="margin-right-1">{{ $t("btn-craft") }}</span>
          <IconWithValue iconClass="icon-gold">{{ craftingFee }}</IconWithValue>
        </div>
      </CustomButton>

      <template v-else-if="recipe.hardCurrencyFee > 0">
        <div class="flex flex-center margin-bottom-1">
          <span class="font-size-20">{{ $t("du-balance") }}</span>

          <IconWithValue class="balance" iconClass="icon-dkt2">{{
            $game.dkt
          }}</IconWithValue>
        </div>

        <CustomButton :disabled="!canCraft" type="yellow" @click="craft">
          <div class="flex flex-center">
            <span class="margin-right-1">{{ $t("btn-craft") }}</span>
            <AshTag :price="recipe.hardCurrencyFee" v-model="ashPrice">
            </AshTag>
          </div>
        </CustomButton>
      </template>
    </div>
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";
import Title from "@/components/Title.vue";
import Loot from "@/components/Loot.vue";
import ItemStats from "@/components/Item/ItemStats.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CraftingBook from "@/metadata/crafting_book";
import Elements from "@/../../knightlands-shared/elements";
import CurrencyType from "@/../../knightlands-shared/currency_type";
import Rarity from "@/../../knightlands-shared/rarity";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ItemPicker from "../../ItemPicker.vue";
import AshTag from "@/components/AshTag.vue";
import InventoryListenerMixin from "@/components/InventoryListenerMixin.vue";

import ItemCreatedPopup from "../../Create/ItemCreatedPopup.vue";
import { create } from "vue-modal-dialogs";

const ShowItemCreated = create(ItemCreatedPopup, "item", "amount");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin, InventoryListenerMixin],
  components: {
    AshTag,
    SoundEffect,
    Title,
    Loot,
    ItemStats,
    CraftingIngridient,
    CustomButton,
    IconWithValue,
    ItemPicker
  },
  props: ["type"],
  created() {
    this.title = "window-new-elem";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    item: null,
    ingridientsKey: 0,
    selectedItemId: 0,
    ashPrice: 0,
    selectedElement: Elements.Water,
    elements: Object.values(Elements).filter(x => x != Elements.Physical)
  }),
  watch: {
    type: {
      immediate: true,
      handler() {
        this.selectedItemId = this.baseItems[0];
      }
    },
    "$route.query.item": {
      immediate: true,
      handler() {
        if (this.$route.query.item) {
          const item = this.$game.inventory.getItem(this.$route.query.item);
          if (item) {
            this.selectedItemId = item.template;
            this.item = item;
          }
        }
      }
    }
  },
  computed: {
    selectedItemIndex() {
      return this.baseItems.findIndex(x => x == this.selectedItemId);
    },
    ingridients() {
      if (this.recipe) {
        return this.recipe.ingridients;
      } else {
        return [];
      }
    },
    recipe() {
      return this.$game.crafting.getRecipe(this.weaponRecipe.recipe);
    },
    weaponRecipe() {
      const entry = CraftingBook.elementalWeapons.find(
        x => x.type == this.type
      );
      return entry;
    },
    baseItems() {
      return this.weaponRecipe.baseItems;
    },
    craftingFee() {
      return this.recipe.softCurrencyFee;
    },
    canCraft() {
      let hasEnough = true;
      for (const ingridient of this.ingridients) {
        if (ingridient.placeholder) {
          continue;
        }

        if (!this.$game.inventory.hasEnoughIngridient(ingridient)) {
          hasEnough = false;
          break;
        }
      }

      return this.$game.dkt >= this.ashPrice && this.item && hasEnough;
    }
  },
  methods: {
    handleInventoryChanged() {
      if (this.item && !this.$game.inventory.hasItem(this.item.id, 1)) {
        this.item = null;
      }
    },
    async craft() {
      const { item } = await this.performRequest(
        this.$game.createWeapon(
          this.weaponRecipe.id,
          CurrencyType.Soft,
          this.item.id,
          this.selectedElement
        )
      );

      this.$refs.fx.play();
      await ShowItemCreated(item, 1);
    },
    selectBaseItem(itemId) {
      this.item = null;
      this.selectedItemId = itemId;
    },
    selectItem() {
      this.$router.push({
        name: "select-for-elem",
        params: {
          itemTemplate: this.selectedItemId,
          rarity: Rarity.Common
        },
        query: { returnTo: this.$route.path }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.selector {
  margin: 1rem;
  display: inline-grid;

  &.preview {
    margin: 0.3rem;
    pointer-events: none;

    & label {
      width: 4rem;
      height: 4rem;
    }

    & span {
      display: none;
    }
  }

  &.disabled {
    & label {
      filter: brightness(1.8) grayscale(1) opacity(0.7);
    }
  }

  & input {
    appearance: none;
    margin: 0;
    padding: 0;
  }

  & label {
    transition: all 100ms ease-in;
    filter: brightness(0.8) opacity(0.9);
  }

  & input:checked + label {
    filter: brightness(1) opacity(1);
  }
}

.selector-border {
  position: absolute;
  left: 0;
  top: 0;
  background: no-repeat url("./../../../../assets/ui/difficulty_selected.png");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
</style>
