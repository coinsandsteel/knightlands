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
                  <Loot
                    v-for="(item, itemIndex) in rarity.items"
                    :id="`i-${item.template}`"
                    :item="item"
                    :key="itemIndex"
                    :inventory="false"
                    :itemSlotClasses="
                      item && item.itemSlotClasses ? item.itemSlotClasses : null
                    "
                    :iconClasses="
                      item && item.iconClasses ? item.iconClasses : null
                    "
                    :class="{
                      'opacity-50':
                        selectedRarityId && item.rarity !== selectedRarityId
                    }"
                    @hint="handleHint"
                  />
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
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import CraftContainer from "@/views/Lunar/CraftContainer.vue";
import LunarElementRaritiesSwitcher from "@/views/Lunar/LunarElementRaritiesSwitcher.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import {
  ITEM_RARITY_BASIC,
  ITEM_RARITY_ADVANCED,
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
      hasCrafted: false
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
      const lanternNumber = info.caption[info.caption.length - 1];

      return {
        id: this.newItem._id,
        rarity: rarity,
        caption: this.newItem.caption,
        template: this.newItem.template,
        iconClasses: `${
          RARITY_CLASS_MAP[this.newItem.rarity]
        } basic-lantern${lanternNumber}`,
        itemSlotClasses: "lunar-lantern-slot",
        isCustomElement: true
      };
    },
    items() {
      let items = this.$game.inventory.items.filter(
        ({ template }) => template >= 3214
      );
      let i = 0;
      const length = items.length;
      let filteredItems = [];
      for (; i < length; ++i) {
        const item = items[i];
        const rarity = this.$game.itemsDB.getRarity(item.template);
        const info = this.$game.itemsDB.getTemplate(item.template);
        const lanternNumber = info.caption[info.caption.length - 1];

        filteredItems.push({
          ...item,
          info,
          rarity,
          iconClasses: `${RARITY_CLASS_MAP[rarity]} basic-lantern${lanternNumber}`,
          itemSlotClasses: "lunar-lantern-slot",
          isCustomElement: true
        });
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
        }
        // {
        //   id: ITEM_RARITY_EXPERT,
        //   name: this.$t("lunar-epic"),
        //   items: this.items.filter(item => item.rarity === ITEM_RARITY_EXPERT),
        //   nameClasses: "rarity-expert-name",
        //   craftItemsCount: 10
        // }
      ];

      return raritys;
    },
    // items() {
    //   const items = [];

    //   for (let i = 1; i < 100; i++) {
    //     const index = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    //     items.push({
    //       id: i,
    //       itemSlotClasses: "lunar-lantern-slot",
    //       iconClasses: "basic-lantern" + index,
    //       isCustomElement: true,
    //       // template: 2928
    //       count: index
    //       // level: 1,
    //       // exp: 0,
    //       // equipped: false,
    //       // breakLimit: 0,
    //       // unique: false,
    //       // rarity: "epic",
    //       // element: "physical",
    //       // index: 13
    //     });
    //   }

    //   return items;
    // },
    selectedItemIds() {
      return this.selectedItems.map(({ id }) => id);
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
        ({ id }) => id === item.id
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
        this.selectedItemId = item.id;
        this.selectedRarityId = item.rarity;
        return;
      }
      this.selectedItemId = null;
    },

    itemRemovedHandler(item) {
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
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
