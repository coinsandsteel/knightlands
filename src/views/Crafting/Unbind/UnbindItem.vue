<template>
  <div class="padding-1 flex flex-column flex-justify-center dummy-height">
    <div class="padding-1 dummy-height flex flex-center flex-column panel" v-if="item">
      <ItemInfo :item="item" :onlyStats="true" :lootProps="{onlyIcon:true}">
        <template v-slot:afterStats>
          <div>
            <div class="flex flex-center margin-top-1 font-size-20">
              <span class="flex flex-center flex-start margin-bottom-half">
                {{$t("max-level")}} {{maxLevel}}
                <span class="margin-left-half margin-right-half right-arrow"></span>
                {{nextMaxLevel}}
              </span>
            </div>

            <div class="flex flex-center">
              <span class="margin-left-1 star" :class="{active: stars >= 1}"></span>
              <span class="star" :class="{active: stars >= 2}"></span>
              <span class="margin-left-half margin-right-half right-arrow"></span>
              <span class="star" :class="{active: futureStars >= 1}"></span>
              <span class="star" :class="{active: futureStars >= 2}"></span>
            </div>
          </div>
        </template>

      </ItemInfo>

      <span class="margin-top-1 margin-bottom-1 title font-size-20">{{$t("unbind-materials")}}</span>

      <div class="flex flex-center full-flex width-100 dummy-height margin-bottom-2">
        <div v-bar class="flex width-100 height-100 dummy-height">
          <div>
            <div class="flex width-100 flex-center dummy-height">
              <loot
                v-for="(item, index) in unbindItems"
                :key="index"
                :item="item"
                :showLevel="true"
                :showUnbindLevels="true"
                :hideQuantity="true"
                :selected="selectedItems[index]"
                :locked="!selectedItems[index] && lockRest"
                @hint="toggleSelectItem(index)"
              />
            </div>
          </div>
        </div>
      </div>

      <CustomButton type="yellow" :disabled="lockedTotal==0" @click="unbind">{{$t("btn-upgrade")}}</CustomButton>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import anime from "animejs/lib/anime.es.js";
import ItemInfo from "@/components/ItemInfo.vue";
import LootContainer from "@/components/LootContainer.vue";
import CustomButton from "@/components/Button.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import Loot from "@/components/Loot.vue";

export default {
  mixins: [AppSection, PromptMixin],
  props: ["itemId"],
  components: { ItemInfo, LootContainer, CustomButton, Loot },
  created() {
    this.title = "window-unbind-item";
    this.$options.useRouterBack = true;
  },
  activated() {
    this.prepareItemForUnbind();
    this.updateUnbindItemsList();
  },
  deactivated() {
    this.cancelUnbind(this.itemId);
  },
  data: () => ({
    item: null,
    selectedMaterial: null,
    unbindItems: [],
    selectedItems: {},
    lockRest: false,
    lockedTotal: 0
  }),
  watch: {
    itemId() {
      this.cancelUnbind();
      this.prepareItemForUnbind();
      this.updateUnbindItemsList();
    }
  },
  computed: {
    maxLevel() {
      return this.$game.itemsDB.getMaxLevel(this.item);
    },
    nextMaxLevel() {
      return this.$game.itemsDB.getMaxLevel(
        this.item,
        this.item.breakLimit + this.lockedTotal
      );
    },
    copiesHave() {
      return this.$game.inventory.getItemsCountByTemplate(this.item.template);
    },
    stars() {
      return this.item.breakLimit;
    },
    futureStars() {
      return this.stars + this.lockedTotal;
    }
  },
  methods: {
    async unbind() {
      let itemName = this.$t(this.$game.itemsDB.getName(this.item.template));
      let itemRarity = this.$game.itemsDB.getRarity(this.item.template);
      let confirmation = await this.showPrompt(
        this.$t("unbind-confirm-title"),
        this.$t("unbind-confirm-text", { item: itemName, rarity: itemRarity }),
        [
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          },
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: "ok"
          }
        ]
      );

      if (confirmation == "ok") {
        let items = {};
        for (let i in this.selectedItems) {
          let unbindItem = this.unbindItems[i];
          if (!items[unbindItem.id]) {
            items[unbindItem.id] = 1;
          } else {
            items[unbindItem.id]++;
          }
        }

        let newItemId = await this.$game.unbindItem(this.itemId, items);
        if (newItemId != this.itemId) {
          this.$router.replace({
            name: "unbind-item",
            params: { itemId: newItemId }
          });
        }

        this.updateUnbindItemsList();
      }
    },
    toggleSelectItem(itemIndex) {
      if (this.lockRest && !this.selectedItems[itemIndex]) {
        return;
      }

      if (this.selectedItems[itemIndex]) {
        this.selectedItems[itemIndex] = !this.selectedItems[itemIndex];
      } else {
        this.$set(this.selectedItems, itemIndex, true);
      }

      if (this.selectedItems[itemIndex]) {
        this.lockedTotal++;
      } else {
        this.$delete(this.selectedItems, itemIndex);
        this.lockedTotal--;
      }

      this.lockRest = 2 - this.item.breakLimit == this.lockedTotal;
    },
    updateUnbindItemsList() {
      this.selectedItems = {};
      this.lockedTotal = 0;
      let filteredItems = [];

      if (this.item) {
        let items = this.$game.inventory.getItemsByTemplate(this.item.template);
        let i = 0;
        const length = items.length;

        for (; i < length; ++i) {
          let item = items[i];
          if (item.unique && item.id == this.itemId) {
            continue;
          }

          let count = item.count;
          if (item.id == this.itemId) {
            count -= 1;
          }

          if (count > 2) {
            count = 2;
          }

          while (count-- > 0) {
            if (item.unique) {
              filteredItems.push(item);
            } else {
              filteredItems.push({
                id: item.id,
                template: item.template
              });
            }
          }
        }
      }

      this.unbindItems = filteredItems;
    },
    cancelUnbind() {
      if (this.item && !this.item.unique) {
        // this.$game.inventory.increaseStack(this.item);
      }
      this.item = null;
    },
    prepareItemForUnbind() {
      let item = this.$game.inventory.getItem(this.itemId);
      if (item) {
        if (!item.unique) {
          item = { ...item };
          item.count = 1;
        }

        this.item = item;
      }
    }
  }
};
</script>