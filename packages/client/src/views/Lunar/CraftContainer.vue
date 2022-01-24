<template>
  <div
    class="craft-container margin-left-auto margin-right-auto padding-top-2 padding-bottom-2 relative"
    :class="`lunar-exchange--${selectedRarityId}`"
  >
    <div class="relative">
      <div
        class="absolute width-100 flex flex-column flex-no-wrap flex-space-between"
      >
        <!-- top -->
        <div>
          <!-- message -->
          <div
            v-if="isCrafting && upgradeMessage && !hasCrafted"
            class="upgrade-message font-size-22 text-center padding-left-2 padding-right-2 margin-left-auto margin-right-auto"
            v-html="upgradeMessage"
          />
        </div>
        <!-- middle -->
        <div>
          <!-- crafted -->
          <template v-if="hasCrafted">
            <Loot
              :item="craftedItem"
              :inventory="false"
              :itemSlotClasses="
                craftedItem && craftedItem.itemSlotClasses
                  ? craftedItem.itemSlotClasses
                  : null
              "
              :iconClasses="
                craftedItem && craftedItem.iconClasses
                  ? craftedItem.iconClasses
                  : null
              "
              class="crafted-element margin-left-auto margin-right-auto relative"
            >
              <!-- @todo: remove -->
              <div
                style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); font-size: 10px; color: red;"
              >
                {{
                  craftedItem && craftedItem.info
                    ? craftedItem.info.caption
                    : null
                }}
              </div>
            </Loot>
            <!-- message -->
            <div
              class="upgraded-message font-size-22 margin-top-3 text-center padding-left-2 padding-right-2"
              v-html="upgradedMessage"
            />
            <div
              v-if="hasNewRecipe"
              class="font-size-22 _margin-top-3 text-center padding-left-2 padding-right-2"
            >
              {{ $t("lunar_new_recipe_added") }}
            </div>
          </template>
          <!-- crafting -->
          <div
            v-else-if="isCrafting"
            class="crafting-elements margin-left-auto margin-right-auto flex flex-center margin-top-4"
          >
            <Loot
              v-for="(item, index) in filteredItems"
              :key="index"
              :item="item"
              :inventory="false"
              :itemSlotClasses="
                item && item.itemSlotClasses ? item.itemSlotClasses : null
              "
              :iconClasses="item && item.iconClasses ? item.iconClasses : null"
              :selected="!(item && item.template)"
              class="margin-left-half margin-right-half margin-bottom-1 relative"
              :class="{ 'opacity-50': item.template && !item.isEnabled }"
              @hint="removeItem(item)"
            >
              <div v-if="item && item.template" class="btn-remove absolute" />
              <!-- @todo: remove -->
              <div
                style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); font-size: 10px; color: red;"
              >
                {{ item && item.info ? item.info.caption : null }}
              </div>
            </Loot>
          </div>
          <!-- ready to craft -->
          <div
            v-else
            class="combine-lantern-message uppercase font-size-30 text-center margin-left-auto margin-right-auto"
          >
            {{ $t("lunar_combine_lantern_message") }}
          </div>
        </div>
        <!-- bottom -->
        <div class="text-center">
          <CustomButton
            :disabled="
              !hasCrafted &&
                (maxSelectedItems === 0 ||
                  (maxSelectedItems > 0 &&
                    !(
                      selectedItems.length === maxSelectedItems &&
                      filteredItems.every(({ isEnabled }) => isEnabled)
                    )))
            "
            type="green"
            class="btn-combine inline-block uppercase padding-left-2"
            @click="craftHandler"
          >
            {{ $t(hasCrafted ? "btn-ok" : "btn-combine") }}
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: {
    Loot,
    CustomButton
  },
  props: {
    maxSelectedItems: { type: Number, required: true },
    selectedItems: { type: Array, required: true },
    isCrafting: { type: Boolean, default: false },
    hasCrafted: { type: Boolean, default: false },
    selectedRarityId: { type: String, default: null },
    craftedItem: { type: Object, default: null }
  },
  data() {
    return {
      items: [null, null, null]
    };
  },
  computed: {
    ...mapState("lunar", ["usedRecipes", "hasNewRecipe"]),
    filteredItems() {
      const result = [];
      const list = [];

      for (let i = 0; i < this.selectedItems.length; i++) {
        const selectedItem = this.selectedItems[i];
        const item = {
          ...selectedItem,
          count: null,
          isEnabled: false
        };
        let addedItem = list.find(
          ({ template }) => template === selectedItem.template
        );

        if (addedItem) {
          addedItem.count++;
        } else {
          addedItem = {
            template: selectedItem.template,
            count: 1
          };
          list.push(addedItem);
        }
        if (selectedItem.count >= addedItem.count) {
          item.isEnabled = true;
        }
        result.push(item);
      }

      result.sort((a, b) => {
        if (a.isEnabled && !b.isEnabled) {
          return -1;
        }
        if (!a.isEnabled && b.isEnabled) {
          return 1;
        }
        return 0;
      });

      return [
        ...result,
        ...Array(this.maxSelectedItems).fill({
          count: null,
          template: null,
          isCustomElement: true,
          itemSlotClasses: "lunar-lantern-slot",
          isEnabled: false
        })
      ].slice(0, this.maxSelectedItems);
    },
    upgradeMessage() {
      if (!this.selectedRarityId) {
        return null;
      }

      return this.$t(`lunar_combine_${this.selectedRarityId}_lantern_message`);
    },
    upgradedMessage() {
      if (!this.craftedItem) {
        return null;
      }

      return this.$t("lunar_combine_lantern_success_message", {
        element: `<b class="capitalize">${this.$t(
          this.craftedItem.caption
        )}</b>`
      });
    }
  },
  watch: {
    usedRecipes(value, oldValue) {
      const newLength = value ? value.length : 0;
      const oldLength = oldValue ? oldValue.length : 0;
      if (newLength > oldLength) {
        this.$store.commit("lunar/updateState", { hasNewRecipe: true });
      }
    }
  },
  methods: {
    removeItem(item) {
      if (!(item && item.template)) {
        return;
      }
      this.$emit("item-removed", item);
    },
    async craftHandler() {
      if (this.hasCrafted) {
        this.$emit("reset-requested");
        return;
      }

      this.$emit("craft-requested");
    }
  }
};
</script>

<style lang="less" scoped>
.craft-container {
  width: 456px;
  max-width: calc(100% - 4rem);
}
.craft-container--common {
  .upgrade-message,
  .upgraded-message {
    &::v-deep b {
      color: #70ee70;
    }
  }
}
.craft-container--rare {
  .upgrade-message,
  .upgraded-message {
    &::v-deep b {
      color: #fe55ff;
    }
  }
}
.craft-container--epic {
  .upgrade-message,
  .upgraded-message {
    &::v-deep b {
      color: #1ae4f6;
    }
  }
}
.craft-container > div {
  background-color: #7c264b;
  border: 1px solid transparent;
  border-image-source: url("/images/lunar/element-crafting-background.png");
  border-image-width: 65px;
  border-image-slice: 130;
  border-image-outset: 0;
  border-image-repeat: round;
  padding-top: 60%;
}
.craft-container > div > div {
  height: calc(100% - 6rem);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.combine-lantern-message {
  max-width: 30rem;
  color: #fde648;
}
.btn-combine {
  padding-left: 3rem;
  padding-right: 3rem;
  min-width: 15rem;
}
.btn-remove {
  top: 0;
  left: 0;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
}
.btn-remove::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.75rem;
  height: 0.375rem;
  border-radius: 1px;
  background: #333;
  transform: translate(-50%, -50%);
}
.upgrade-message {
  max-width: calc(100% - 130px);
}
.crafted-element::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140px;
  height: 140px;
  transform: translate(-50%, -50%);
  background-image: url("/images/lunar/glow.png");
  background-size: 100% 100%;
}
.crafting-elements {
  max-width: 50rem;
}
</style>
