<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>
    <SoundEffect ref="fx" :files="['accessory_craft']" channel="fx" />

    <AccessoryTemplateInfo
      class="color-panel-1 margin-bottom-2"
      :template="+template"
      v-if="template"
    />

    <CraftingIngridient :ingridient="ingridient" />

    <div class="flex flex-column flex-center margin-top-2">
      <div class="flex flex-center margin-bottom-1">
        <span class="font-size-20">{{ $t("du-balance") }}</span>

        <IconWithValue class="balance" iconClass="icon-dkt2">{{
          $game.dkt
        }}</IconWithValue>
      </div>

      <CustomButton type="yellow" @click="craft" :disabled="!canCraft">
        <div class="flex flex-center">
          <span class="margin-right-1">{{ $t("btn-craft") }}</span>
          <AshTag :price="recipe.price" v-model="craftPrice"> </AshTag></div
      ></CustomButton>
    </div>
  </div>
</template>

<script>
import SoundEffect from "@/components/SoundEffect.vue";
import AppSection from "@/AppSection.vue";
import AccessoryTemplateInfo from "./AccessoryTemplateInfo.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import CraftAccessories from "@/craft_accessories";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AshTag from "@/components/AshTag.vue";
import IconWithValue from "@/components/IconWithValue.vue";

import ItemCreatedPopup from "../../Create/ItemCreatedPopup.vue";
import { create } from "vue-modal-dialogs";

const ShowItemCreated = create(ItemCreatedPopup, "item", "amount");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  props: ["ring", "template"],
  components: {
    IconWithValue,
    AshTag,
    AccessoryTemplateInfo,
    CraftingIngridient,
    CustomButton,
    SoundEffect
  },
  created() {
    this.$options.useRouterBack = true;
    this.title = "win-create-acc";
  },
  data: () => ({
    craftPrice: 0
  }),
  computed: {
    canCraft() {
      return (
        this.$game.inventory.hasEnoughIngridient(this.ingridient) &&
        this.craftPrice <= this.$game.dkt
      );
    },
    isRing() {
      if (typeof this.ring === "string") {
        return this.ring === "true";
      }

      return this.ring;
    },
    rarity() {
      return this.$game.itemsDB.getRarity(this.template);
    },
    recipe() {
      return CraftAccessories.recipes.find(x => x.rarity == this.rarity);
    },
    ingridient() {
      return {
        itemId: this.recipe.resource,
        quantity: this.recipe.resourceCount
      };
    }
  },
  methods: {
    async craft() {
      const items = await this.performRequest(
        this.$game.createAccessory(this.template, 1)
      );
      this.$refs.fx.play();
      await ShowItemCreated(items[0], 1);
    }
  }
};
</script>
