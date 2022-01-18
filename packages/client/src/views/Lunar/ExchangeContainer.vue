<template>
  <div
    class="exchange-container margin-left-auto margin-right-auto padding-top-2 padding-bottom-2 relative"
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
            v-if="isExchanging && upgradeMessage && !hasExchanged"
            class="upgrade-message font-size-22 text-center padding-left-2 padding-right-2 margin-left-auto margin-right-auto"
            v-html="upgradeMessage"
          />
        </div>
        <!-- middle -->
        <div>
          <!-- exchanged -->
          <template v-if="hasExchanged">
            <Loot
              :item="exchangedItem"
              :inventory="false"
              :itemSlotClasses="
                exchangedItem && exchangedItem.itemSlotClasses
                  ? exchangedItem.itemSlotClasses
                  : null
              "
              :iconClasses="
                exchangedItem && exchangedItem.iconClasses
                  ? exchangedItem.iconClasses
                  : null
              "
              class="exchanged-element margin-left-auto margin-right-auto relative"
            />
            <!-- message -->
            <div
              class="upgraded-message font-size-22 margin-top-3 text-center padding-left-2 padding-right-2"
              v-html="upgradedMessage"
            />
          </template>
          <!-- exchanging -->
          <div
            v-else-if="isExchanging"
            class="exchanging-elements margin-left-auto margin-right-auto flex flex-center margin-top-4"
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
              :selected="!(item && item.id)"
              class="margin-left-half margin-right-half margin-bottom-1 relative"
              @hint="removeItem(item)"
            >
              <div v-if="item && item.id" class="btn-remove absolute" />
            </Loot>
          </div>
          <!-- ready to exchange -->
          <div
            v-else
            class="exchange-lantern-message uppercase font-size-30
              text-center margin-left-auto margin-right-auto"
            v-html="$t('lunar_exchange_lantern_message')"
          />
        </div>
        <!-- bottom -->
        <div class="text-center">
          <CustomButton
            :disabled="
              !hasExchanged && selectedItems.length !== maxSelectedItems
            "
            type="green"
            class="btn-exchange inline-block uppercase padding-left-2"
            @click="exchangeHandler"
          >
            {{ $t(hasExchanged ? "btn-ok" : "btn-exchange") }}
          </CustomButton>
        </div>
        <!-- <div class="text-center margin-top-4">
          <CustomButton
            :disabled="!hasCrafted && selectedItems.length !== maxSelectedItems"
            type="green"
            class="btn-combine inline-block uppercase padding-left-2"
            @click="craftHandler"
          >
            {{ $t(hasCrafted ? "btn-ok" : "btn-combine") }}
          </CustomButton>
        </div> -->
        <!-- crafted -->
        <!-- <template v-if="false && hasCrafted">
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
          />
          <div
            class="upgraded-message font-size-22 margin-top-3 text-center padding-left-2 padding-right-2"
            v-html="upgradedMessage"
          />
        </template> -->
        <!-- crafting -->
        <!-- <template v-else-if="false && selectedItems.length > 0">
          <div class="flex flex-center margin-top-4">
            <Loot
              v-for="(item, index) in filteredItems"
              :key="index"
              :item="item"
              :inventory="false"
              :itemSlotClasses="
                item && item.itemSlotClasses ? item.itemSlotClasses : null
              "
              :iconClasses="item && item.iconClasses ? item.iconClasses : null"
              class="margin-left-2 margin-right-2 relative"
              @hint="removeItem(item)"
            >
              <div v-if="item && item.id" class="btn-remove absolute" />
            </Loot>
          </div>
          <div
            v-if="upgradeMessage"
            class="upgrade-message font-size-22 margin-top-2 text-center padding-left-2 padding-right-2"
            v-html="upgradeMessage"
          />
        </template> -->
        <!-- ready to craft -->
        <!-- <div
          v-else-if="false"
          class="combine-lantern-message uppercase font-size-30 text-center margin-left-auto margin-right-auto"
        >
          {{ $t("lunar_combine_lantern_message") }}
        </div> -->
        <!-- craft / ok button -->
        <!-- <div v-if="false" class="text-center margin-top-4">
          <CustomButton
            :disabled="!hasCrafted && selectedItems.length !== maxSelectedItems"
            type="green"
            class="btn-combine inline-block uppercase padding-left-2"
            @click="craftHandler"
          >
            {{ $t(hasCrafted ? "btn-ok" : "btn-combine") }}
          </CustomButton>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
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
    isExchanging: { type: Boolean, default: false },
    hasExchanged: { type: Boolean, default: false },
    selectedRarityId: { type: String, default: null }
  },
  data() {
    return {
      items: [null, null, null],
      exchangedItem: {
        id: 1,
        isCustomElement: true,
        itemSlotClasses: "lunar-lantern-slot",
        iconClasses: "basic-lantern1"
      }
    };
  },
  computed: {
    filteredItems() {
      return [
        ...this.selectedItems.map(item => ({
          ...item,
          count: null
        })),
        ...Array(this.maxSelectedItems).fill({
          isCustomElement: true,
          itemSlotClasses: "lunar-lantern-slot"
        })
      ].slice(0, this.maxSelectedItems);
    },
    upgradeMessage() {
      if (!this.selectedRarityId) {
        return null;
      }

      // return this.$t("lunar_combine_lantern_upgrade_message", {
      //   level: `<b class="capitalize">${this.$t(this.nextLevel)}</b>`
      // });

      return this.$t(`lunar_exchange_common_lantern_message`, {
        element: `<b class="capitalize">${this.$t(
          "lunar-" + this.selectedRarityId
        )}</b>`
      });
    },
    upgradedMessage() {
      return this.$t("lunar_exchange_lantern_success_message", {
        element: `<b class="capitalize">Spring Spirit</b>`
      });
    }
  },
  methods: {
    removeItem(item) {
      if (!(item && item.id)) {
        return;
      }
      this.$emit("item-removed", item);
    },
    async exchangeHandler() {
      if (this.hasExchanged) {
        this.$emit("reset-requested");
        return;
      }

      this.$emit("exchange-requested");
    }
  }
};
</script>

<style lang="less" scoped>
.exchange-container {
  width: 456px;
  max-width: calc(100% - 4rem);
}
// .exchange-container--common {
//   .upgrade-message,
//   .upgraded-message {
//     &::v-deep b {
//       color: #70ee70;
//     }
//   }
// }
.exchange-container--rare {
  .upgrade-message,
  .upgraded-message {
    &::v-deep b {
      color: #70ee70;
    }
  }
}
.exchange-container--epic {
  .upgrade-message,
  .upgraded-message {
    &::v-deep b {
      color: #fe55ff;
    }
  }
}
.exchange-container > div {
  background-color: #1a5a76;
  border: 1px solid transparent;
  border-image-source: url("/images/lunar/element-exchanging-background.png");
  border-image-width: 65px;
  border-image-slice: 130;
  border-image-outset: 0;
  border-image-repeat: round;
  padding-top: 60%;
}
.exchange-container > div > div {
  height: calc(100% - 6rem);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.exchange-lantern-message {
  max-width: 50rem;
}
.btn-exchange {
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
  // margin-bottom: -1.5rem;
  max-width: calc(100% - 130px);
}
// .upgraded-message {
//   margin-bottom: -0.5rem;
// }
.exchanged-element::before {
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
.exchanging-elements {
  max-width: 50rem;
}
</style>
