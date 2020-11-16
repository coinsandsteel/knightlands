<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>

    <AccessoryTemplateInfo
      class="color-panel-1 margin-bottom-2"
      :template="+template"
      v-if="template"
    />

    <CraftingIngridient :ingridient="ingridient" />

    <div class="flex flex-center margin-top-2">
      <CustomButton type="yellow" @click="craft">{{
        $t("btn-craft")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import AccessoryTemplateInfo from "./AccessoryTemplateInfo.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import CraftAccessories from "@/craft_accessories";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

import ItemCreatedPopup from "../../Create/ItemCreatedPopup.vue";
import { create } from "vue-modal-dialogs";

const ShowItemCreated = create(ItemCreatedPopup, "item", "amount");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  props: ["ring", "template"],
  components: { AccessoryTemplateInfo, CraftingIngridient, CustomButton },
  created() {
    this.$options.useRouterBack = true;
    this.title = "win-create-acc";
  },
  computed: {
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
      await ShowItemCreated(items[0], 1);
    }
  }
};
</script>
