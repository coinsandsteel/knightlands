<template>
  <div
    class="craft-container margin-left-auto margin-right-auto padding-top-4 padding-bottom-4 relative"
  >
    <div class="relative">
      <div class="absolute width-100">
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
          />
          <div
            class="upgraded-message font-size-22 margin-top-3 text-center padding-left-2 padding-right-2"
            v-html="upgradedMessage"
          />
        </template>
        <!-- crafting -->
        <template v-else-if="selectedItems.length > 0">
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
        </template>
        <!-- ready to craft -->
        <div
          v-else
          class="combine-lantern-message uppercase font-size-30 text-center margin-left-auto margin-right-auto"
        >
          {{ $t("lunar_combine_lantern_message") }}
        </div>
        <!-- craft / ok button -->
        <div class="text-center margin-top-4">
          <CustomButton
            :disabled="!hasCrafted && selectedItems.length !== maxSelectedItems"
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
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
export default {
  components: {
    Loot,
    CustomButton
  },
  props: {
    maxSelectedItems: { type: Number, required: true },
    selectedItems: { type: Array, required: true }
  },
  data() {
    return {
      items: [null, null, null],
      hasCrafted: false,
      craftedItem: {
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
      return this.$t("lunar_combine_lantern_upgrade_message", {
        level: `<b class="capitalize">${this.$t("advanced")}</b>`
      });
    },
    upgradedMessage() {
      return this.$t("lunar_combine_lantern_success_message", {
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
    craftHandler() {
      if (this.hasCrafted) {
        this.hasCrafted = false;
        this.$emit("items-reset");
        return;
      }

      this.hasCrafted = true;
    }
  }
};
</script>

<style lang="less" scoped>
.craft-container {
  width: 440px;
  max-width: 90%;
}
.craft-container > div {
  background-image: url("/images/lunar/element-crafting-background.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-top: 75%;
}
.craft-container > div > div {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.combine-lantern-message {
  max-width: 30rem;
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
  margin-bottom: -1.5rem;
}
.upgraded-message {
  margin-bottom: -0.5rem;
}
.upgrade-message,
.upgraded-message {
  &::v-deep b {
    color: #70ee70;
  }
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
</style>
