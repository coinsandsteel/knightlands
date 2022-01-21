<template>
  <div class="screen-content">
    <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <CraftContainer
          :maxSelectedItems="
            selectedRarity ? selectedRarity.craftItemsCount : 0
          "
          :selectedItems="selectedItems"
          :hasCrafted="hasCrafted && !!craftedItem"
          :isCrafting="isCrafting"
          :selectedRarityId="selectedRarityId"
          :craftedItem="craftedItem"
          :class="
            selectedRarityId ? `craft-container--${selectedRarityId}` : null
          "
          @item-removed="itemRemovedHandler"
          @reset-requested="itemsResetHandler"
          @craft-requested="craftHandler"
        />
        <div class="inv-root dummy-height full-flex width-100 height-100">
          <div v-bar class="center width-100 height-100 dummy-height">
            <div>
              <template v-for="(rarity, rarityIndex) in itemRaritys">
                <div
                  class="rarity-name font-size-25 text-align-left padding-top-1 padding-bottom-1 padding-left-2 padding-right-2 capitalize"
                  :key="`rarity-name-${rarityIndex}`"
                  :class="rarity.class"
                >
                  {{ rarity.name }}
                </div>
                <div
                  :key="`rarity-${rarityIndex}`"
                  class="element-rarity width-100 dummy-height inventory-container margin-top-1 margin-bottom-1  padding-left-1 padding-right-1"
                >
                  <template v-for="(item, itemIndex) in rarity.items">
                    <Loot
                      v-if="item.count > 0"
                      :id="`i-${item.template}`"
                      :item="item"
                      :key="itemIndex"
                      :inventory="false"
                      :itemSlotClasses="
                        item && item.itemSlotClasses
                          ? item.itemSlotClasses
                          : null
                      "
                      :iconClasses="
                        item && item.iconClasses ? item.iconClasses : null
                      "
                      :class="{
                        'opacity-50':
                          selectedRarityId && item.rarity !== selectedRarityId
                      }"
                      @hint="handleHint"
                    >
                      <!-- @todo: remove -->
                      <div
                        style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); font-size: 10px; color: red;"
                      >
                        {{ item && item.info ? item.info.caption : null }}
                      </div>
                    </Loot>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- levels switcher -->
    <portal v-if="false && isActive" to="footer" :slim="true">
      <LunarElementRaritiesSwitcher @rarity-updated="rarityUpdatedHandler" />
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getLanternIcon } from "@/helpers/utils";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CraftContainer from "@/views/Lunar/CraftContainer.vue";
import LunarElementRaritiesSwitcher from "@/views/Lunar/LunarElementRaritiesSwitcher.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import {
  ITEM_RARITY_BASIC,
  ITEM_RARITY_ADVANCED,
  ITEM_RARITY_EXPERT,
  RARITY_CLASS_MAP
} from "@/../../knightlands-shared/lunar";

export default {
  components: {
    CraftContainer,
    Loot,
    LunarElementRaritiesSwitcher
  },
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  data() {
    return {
      selectedItems: [],
      lootClasses: [],
      selected: {},
      selectedItemId: null,
      maxSelectedItems: 3,
      selectedRarityId: null,
      hasCrafted: false,
      craftingElementsFromRecipe: []
    };
  },
  computed: {
    ...mapState("lunar", ["newItem"]),
    craftedItem() {
      if (!this.newItem) {
        return null;
      }

      const rarity = this.$game.itemsDB.getRarity(this.newItem.template);
      const info = this.$game.itemsDB.getTemplate(this.newItem.template);
      const icon = info.icon || getLanternIcon(info.id);

      return {
        id: this.newItem._id,
        info,
        rarity: rarity,
        caption: this.newItem.caption,
        template: this.newItem.template,
        iconClasses: `${RARITY_CLASS_MAP[this.newItem.rarity]} ${icon}`,
        itemSlotClasses: "lunar-lantern-slot",
        isCustomElement: true
      };
    },
    items() {
      let items = this.$game.inventory.items.filter(({ template }) => {
        const info = this.$game.itemsDB.getTemplate(template);
        return info.type === "lunarResource";
      });

      const length = items.length;
      let filteredItems = [];
      for (let i = 0; i < length; ++i) {
        const item = items[i];
        const rarity = this.$game.itemsDB.getRarity(item.template);
        const info = this.$game.itemsDB.getTemplate(item.template);
        const icon = info.icon || getLanternIcon(info.id);

        filteredItems.push({
          ...item,
          info,
          rarity,
          iconClasses: `${RARITY_CLASS_MAP[rarity]} ${icon}`,
          itemSlotClasses: "lunar-lantern-slot",
          isCustomElement: true
        });
      }
      // items from recipes
      const ingredientsLength = this.craftingElementsFromRecipe.length;
      for (let i = 0; i < ingredientsLength; i++) {
        const item = { ...this.craftingElementsFromRecipe[i], count: 0 };
        const rarity = this.$game.itemsDB.getRarity(item.template);
        const info = this.$game.itemsDB.getTemplate(item.template);
        const icon = info.icon || getLanternIcon(info.id);

        if (!filteredItems.find(({ template }) => template === item.template)) {
          filteredItems.push({
            ...item,
            info,
            rarity,
            iconClasses: `${RARITY_CLASS_MAP[rarity]} ${icon}`,
            itemSlotClasses: "lunar-lantern-slot",
            isCustomElement: true
          });
        }
      }
      return filteredItems;
    },
    itemRaritys() {
      const raritys = [
        {
          id: ITEM_RARITY_BASIC,
          name: this.$t("lunar-common"),
          items: this.items.filter(item => item.rarity === ITEM_RARITY_BASIC),
          craftItemsCount: 3,
          class: "rarity-basic-name"
        },
        {
          id: ITEM_RARITY_ADVANCED,
          name: this.$t("lunar-rare"),
          items: this.items.filter(
            item => item.rarity === ITEM_RARITY_ADVANCED
          ),
          nameClasses: "rarity-advanced-name",
          craftItemsCount: 2
        } /*,
        {
          id: ITEM_RARITY_EXPERT,
          name: this.$t("lunar-epic"),
          items: this.items.filter(item => item.rarity === ITEM_RARITY_EXPERT),
          nameClasses: "rarity-expert-name",
          craftItemsCount: 10
        }*/
      ];

      return raritys;
    },
    selectedItemIds() {
      return this.selectedItems.map(({ template }) => template);
    },

    selectedRarity() {
      if (!this.selectedRarityId) {
        return null;
      }

      return this.itemRaritys.find(({ id }) => id === this.selectedRarityId);
    },

    isCrafting() {
      return this.selectedItemIds.length > 0;
    }

    // nextLevel() {
    //   switch (this.selectedRarityId) {
    //     case GROUP.BASIC:
    //       return GROUP.ADVANCED;
    //     case GROUP.ADVANCED:
    //       return GROUP.EXPERT;
    //     case GROUP.EXPERT:
    //       return "nft";

    //     default:
    //       return null;
    //   }
    // }
  },
  // watch: {
  //   "$route.params.rarity": {
  //     handler: function(rarity) {
  //       if (this.$route.name !== "lunar-craft") {
  //         return;
  //       }
  //       if (rarity && !Object.values(GROUP).includes(rarity)) {
  //         this.$router.replace({ params: null });
  //         return;
  //       }
  //       // eslint-disable-next-line no-console
  //       console.log("rarity", rarity);
  //       // if () {

  //       // }
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },

  watch: {
    newItem(value) {
      if (value) {
        this.hasCrafted = true;
      }
    }
  },

  created() {
    this.craftingElementsFromRecipe = [
      ...(this.$store.state.lunar.craftingElementsFromRecipe || [])
    ];
    this.$store.commit("lunar/updateState", { craftingElementsFromRecipe: [] });
  },

  mounted() {
    // added selected items from recipes
    if (this.craftingElementsFromRecipe.length > 0) {
      let rarity = null;
      this.selectedItems = [];
      for (let i = 0; i < this.craftingElementsFromRecipe.length; i++) {
        const template = this.craftingElementsFromRecipe[i].template;
        rarity = this.craftingElementsFromRecipe[i].rarity;
        const item = this.items.find(
          ({ template: itemTemplate }) => template === itemTemplate
        );
        if (item) {
          this.selectedItems.push(item);
        }
      }
      this.selectedRarityId = rarity;
    }
  },

  methods: {
    handleHint(item) {
      if (this.selectedRarityId && item.rarity !== this.selectedRarityId) {
        return;
      }
      // if (this.selectedItems.length <= 0) {
      //   this.selectedRarityId = item.rarity;
      // }
      // const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      const selectedItemsWithSameId = this.selectedItems.filter(
        ({ template }) => template === item.template
      );
      // if (index >= 0) {
      //   this.selectedItems.splice(index, 1);
      //   this.selectedItemId = null;
      // } else if (this.selectedItems.length < this.maxSelectedItems) {
      //   this.selectedItems.push(item);
      //   this.selectedItemId = item.id;
      // } else {
      //   this.selectedItemId = null;
      // }
      if (
        selectedItemsWithSameId.length < item.count &&
        (!this.selectedRarity ||
          (this.selectedRarity &&
            this.selectedItems.length < this.selectedRarity.craftItemsCount))
      ) {
        this.selectedItems.push(item);
        this.selectedItemId = item.template;
        this.selectedRarityId = item.rarity;
        return;
      }
      this.selectedItemId = null;
    },

    itemRemovedHandler(item) {
      const index = this.selectedItems.findIndex(
        ({ template }) => template === item.template
      );
      this.selectedItems.splice(index, 1);
      this.selectedItemId = null;
      if (this.selectedItems.length <= 0) {
        this.selectedRarityId = null;
      }
    },

    itemsResetHandler() {
      this.selectedItems = [];
      this.selectedItemId = null;
      this.selectedRarityId = null;
      this.hasCrafted = false;
      this.$store.commit("lunar/updateState", { newItem: null });
    },

    rarityUpdatedHandler(rarity) {
      if (this.selectedRarityId === rarity) {
        return;
      }
      this.itemsResetHandler();
      this.selectedRarityId = rarity;
    },

    async craftHandler() {
      if (this.hasCrafted) {
        return;
      }

      await this.performRequestNoCatch(
        this.$store.dispatch("lunar/craft", this.selectedItems)
      );

      // this.hasCrafted = true;
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.element-rarity {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  grid-gap: 2rem;
}
.rarity-name {
  background: rgba(0, 0, 0, 0.5);
}
.rarity-advanced-name {
  color: #09fa08;
}
.rarity-expert-name {
  color: #fe55ff;
}
</style>
