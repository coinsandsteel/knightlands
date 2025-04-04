<template>
  <div class="screen-content padding-top-1">
    <div class="screen-background"></div>
    <div v-bar>
      <div>
        <div class="dummy-height flex flex-center flex-column" v-if="item">
          <ItemInfo
            :item="item"
            :onlyStats="true"
            :lootProps="{ onlyIcon: true }"
            class="width-100"
          >
            <template v-slot:afterStats>
              <div class="color-panel-1">
                <div class="flex flex-center font-size-20 margin-bottom-1">
                  <span> {{ $t("max-level") }} {{ maxLevel }} </span>

                  <span
                    class="margin-left-half margin-right-half right-arrow"
                  ></span>

                  <span>{{ nextMaxLevel }}</span>
                </div>

                <div class="flex flex-center">
                  <span
                    class="margin-left-1 star"
                    :class="{ active: stars >= 1 }"
                  ></span>
                  <span class="star" :class="{ active: stars >= 2 }"></span>
                  <span
                    class="margin-left-half margin-right-half right-arrow"
                  ></span>
                  <span
                    class="star"
                    :class="{ active: futureStars >= 1 }"
                  ></span>
                  <span
                    class="star"
                    :class="{ active: futureStars >= 2 }"
                  ></span>
                </div>
              </div>
            </template>
          </ItemInfo>

          <Title class="margin-top-1 margin-bottom-1">{{
            $t("unbind-materials")
          }}</Title>

          <div
            class="flex flex-center full-flex width-100 dummy-height margin-bottom-2 upgrade-height-fix"
          >
            <span v-if="isAtMaxUnbind" class="font-size-20 yellow-title">{{
              $t("unbind-max-level")
            }}</span>
            <template v-else-if="unbindItems.length > 0">
              <div v-bar class="width-100 height-100 dummy-height">
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
            </template>
            <span v-else-if="!lockRest" class="font-size-20">{{
              $t("unbind-no-items")
            }}</span>
          </div>

          <CustomButton type="yellow" v-if="isAtMaxUnbind" @click="levelUp">{{
            $t("btn-level-up")
          }}</CustomButton>
          <div v-else class="flex flex-center">
            <CustomButton
              type="yellow"
              :disabled="lockedTotal == 0"
              @click="unbind"
              >{{ $t("btn-upgrade") }}</CustomButton
            >
            <CustomButton type="grey" @click="craft">{{
              $t("btn-craft-more")
            }}</CustomButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import anime from "animejs/lib/anime.es.js";
import ItemInfo from "@/components/ItemInfo.vue";
import CustomButton from "@/components/Button.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import Loot from "@/components/Loot.vue";
import Title from "@/components/Title.vue";
import DustRecipes from "@/metadata/dust_recipes";
import InventoryListenerMixin from "@/components/InventoryListenerMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [
    AppSection,
    PromptMixin,
    InventoryListenerMixin,
    NetworkRequestErrorMixin
  ],
  props: ["itemId"],
  components: { ItemInfo, CustomButton, Loot, Title },
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
    newItemId: 0,
    selectedMaterial: null,
    unbindItems: [],
    selectedItems: {},
    lockedTotal: 0
  }),
  watch: {
    newItemId() {
      this.handleInventoryChanged();
    },
    itemId() {
      this.cancelUnbind();
      this.prepareItemForUnbind();
      this.updateUnbindItemsList();
    }
  },
  computed: {
    isAtMaxUnbind() {
      return this.stars == 2;
    },
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
    },
    lockRest() {
      return 2 - this.stars == this.lockedTotal;
    }
  },
  methods: {
    handleInventoryChanged() {
      if (this.newItemId != 0) {
        this.$router.replace({
          name: "unbind-item",
          params: { itemId: this.newItemId },
          query: this.$route.query
        });
        this.newItemId = 0;
      }

      this.updateUnbindItemsList();
    },
    craft() {
      let query = { returnTo: this.$route.fullPath };
      if (this.$route.query) {
        query = this.$route.query;
      }

      this.$router.push({
        name: "craft",
        params: { recipeId: DustRecipes[this.item.template] },
        query
      });
    },
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

        let newItemId = await this.performRequest(
          this.$game.unbindItem(this.itemId, items)
        );

        console.log(newItemId != this.itemId);
        if (newItemId != this.itemId) {
          this.newItemId = newItemId;
        }
      }
    },
    toggleSelectItem(itemIndex) {
      if (
        this.unbindItems[itemIndex].locked ||
        (this.lockRest && !this.selectedItems[itemIndex])
      ) {
        return;
      }

      const state = this.selectedItems[itemIndex];

      if (state !== undefined) {
        this.selectedItems[itemIndex] = !state;
      } else {
        this.$set(this.selectedItems, itemIndex, true);
      }

      if (this.selectedItems[itemIndex]) {
        this.lockedTotal++;
      } else {
        this.$delete(this.selectedItems, itemIndex);
        this.lockedTotal--;
      }
    },
    updateUnbindItemsList() {
      this.selectedItems = {};
      this.lockedTotal = 0;

      let filteredItems = [];

      if (this.item) {
        const targetRarity = this.$game.itemsDB.getRarity(this.item);
        let items = this.$game.inventory.getItemsByTemplate(this.item.template);

        if (items) {
          let i = 0;
          const length = items.length;

          for (; i < length; ++i) {
            let item = items[i];
            if (
              this.$game.itemsDB.getRarity(item) != targetRarity ||
              item.equipped
            ) {
              continue;
            }

            if (item.unique && item.id == this.itemId) {
              continue;
            }

            let count = item.count;
            if (item.id == this.itemId && !this.item.equipped) {
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

      if (item && !item.equipped) {
        if (!item.unique) {
          item = { ...item };
          item.count = 1;
        }
      }

      if (item) {
        this.item = item;
      }
    },
    levelUp() {
      this.$router.replace({
        name: "upgrade-item",
        params: { itemId: this.item.id },
        query: this.$route.query
      });
    }
  }
};
</script>

<style lang="less" scoped>
.upgrade-height-fix {
  min-height: 7rem;
}
</style>
