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
            >
              <!-- @todo: remove -->
              <div
                style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -100%); font-size: 10px; color: red;"
              >
                {{
                  exchangedItem && exchangedItem.info
                    ? exchangedItem.info.caption
                    : null
                }}
              </div>
            </Loot>
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
              :selected="!(item && item.template)"
              class="margin-left-half margin-right-half margin-bottom-1 relative"
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
              !hasExchanged &&
                (maxSelectedItems === 0 ||
                  (maxSelectedItems > 0 &&
                    selectedItems.length !== maxSelectedItems))
            "
            type="green"
            class="btn-exchange inline-block uppercase padding-left-2"
            @click="exchangeHandler"
          >
            {{ $t(hasExchanged ? "btn-ok" : "btn-exchange") }}
          </CustomButton>
        </div>
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
    selectedRarityId: { type: String, default: null },
    exchangedItem: { type: Object, default: null }
  },
  data() {
    return {
      items: [null, null, null]
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

      return this.$t(`lunar_exchange_common_lantern_message`, {
        element: `<b class="capitalize">${this.$t(
          "lunar-" + this.selectedRarityId
        )}</b>`
      });
    },
    upgradedMessage() {
      if (!this.exchangedItem) {
        return null;
      }

      return this.$t("lunar_exchange_lantern_success_message", {
        element: `<b class="capitalize">${this.$t(
          this.exchangedItem.caption
        )}</b>`
      });
    }
  },
  methods: {
    removeItem(item) {
      if (!(item && item.template)) {
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
  max-width: calc(100% - 130px);
}
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
